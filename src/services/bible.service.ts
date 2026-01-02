import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom, of, forkJoin, throwError } from 'rxjs';
import { map, catchError, switchMap, tap, startWith } from 'rxjs/operators';

export interface ReadingState {
  title: string;
  reference: string;
  content: {
    value?: { text: string; reference: string; };
    loading: boolean;
    error?: string;
  };
}

interface BollsBook {
  bookid: number;
  name: string;
  chronorder: number;
  chapters: number;
}

interface BollsVerse {
  pk: number;
  verse: number;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class BibleService {
  private http = inject(HttpClient);
  
  private readonly baseUrl = 'https://bolls.life';
  private readonly translation = 'RSV2CE';
  
  // Cache for book mapping: "Genesis" -> 1
  private books = signal<Map<string, number>>(new Map());
  private booksLoaded = false;

  constructor() {
    this.initBooks();
  }

  private initBooks() {
    this.http.get<BollsBook[]>(`${this.baseUrl}/get-books/${this.translation}/`).pipe(
      tap(books => {
        const map = new Map<string, number>();
        books.forEach(b => {
          // Normalize keys for easier lookup (lowercase, remove spaces)
          map.set(this.normalizeName(b.name), b.bookid);
          
          // Handle common variations if necessary
          if (b.name === 'Song of Solomon') map.set('songofsongs', b.bookid);
          if (b.name === 'Wisdom of Solomon') map.set('wisdom', b.bookid);
          if (b.name === 'Ecclesiasticus') map.set('sirach', b.bookid);
          if (b.name === 'Psalms') map.set('psalm', b.bookid);
        });
        this.books.set(map);
        this.booksLoaded = true;
      }),
      catchError(err => {
        console.error('Failed to load books from Bolls Life', err);
        return of([]);
      })
    ).subscribe();
  }

  fetchVerse(reference: string, title: string = ''): Observable<ReadingState> {
    if (!reference) {
      return of({ title, reference, content: { loading: false } });
    }

    // Wait for books to load if they haven't yet (simple polling fallback or observable chaining)
    // Since init is in constructor, we wrap logic in an Observable flow
    const bookMap$ = this.booksLoaded 
      ? of(this.books()) 
      : this.http.get<BollsBook[]>(`${this.baseUrl}/get-books/${this.translation}/`).pipe(
          map(books => {
            const map = new Map<string, number>();
            books.forEach(b => {
              map.set(this.normalizeName(b.name), b.bookid);
              if (b.name === 'Song of Solomon') map.set('songofsongs', b.bookid);
              if (b.name === 'Wisdom of Solomon') map.set('wisdom', b.bookid);
              if (b.name === 'Ecclesiasticus') map.set('sirach', b.bookid);
              if (b.name === 'Psalms') map.set('psalm', b.bookid);
            });
            this.books.set(map);
            this.booksLoaded = true;
            return map;
          })
        );

    return bookMap$.pipe(
      switchMap(bookMap => this.processReference(reference, bookMap)),
      map(html => ({
        title,
        reference,
        content: {
          value: { text: html, reference },
          loading: false
        }
      })),
      catchError(err => {
        console.error('Error fetching reading', err);
        return of({
          title,
          reference,
          content: {
            loading: false,
            error: `Could not retrieve "${reference}". ${err.message || 'Unknown error.'}`
          }
        });
      }),
      startWith({ title, reference, content: { loading: true } })
    );
  }

  private normalizeName(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  private processReference(fullRef: string, bookMap: Map<string, number>): Observable<string> {
    // 1. Parse the book name and location
    // Regex: Start with optional number, then text, then space, then the rest
    // e.g. "1 Kings 12" -> "1 Kings", "12"
    // "Genesis 1-2" -> "Genesis", "1-2"
    const match = fullRef.match(/^(\d?\s?[A-Za-z]+(?:\s[A-Za-z]+)*)\s+(.+)$/);
    
    if (!match) {
      return throwError(() => new Error('Invalid reference format'));
    }

    const bookName = match[1].trim();
    const locationStr = match[2].trim();

    const bookId = bookMap.get(this.normalizeName(bookName));
    if (!bookId) {
      return throwError(() => new Error(`Book "${bookName}" not found in RSV2CE`));
    }

    // 2. Parse locations (Chapters/Verses)
    // Supports:
    // "1" (Chapter 1)
    // "1-2" (Chapters 1 through 2)
    // "1:1-7" (Chapter 1, verses 1-7)
    // "3, 13" (Chapter 3 and Chapter 13)
    
    // Split by comma for disjoint parts (e.g. Esther 3, 13)
    const parts = locationStr.split(',').map(p => p.trim());
    const tasks: Observable<string>[] = [];

    parts.forEach(part => {
      if (part.includes(':')) {
        // Specific verses: "1:1-7"
        const [chapterStr, verseRange] = part.split(':');
        const chapter = parseInt(chapterStr, 10);
        tasks.push(this.getChapterText(bookId, chapter, verseRange));
      } else if (part.includes('-')) {
        // Chapter range: "1-2"
        const [start, end] = part.split('-').map(n => parseInt(n, 10));
        for (let c = start; c <= end; c++) {
          tasks.push(this.getChapterText(bookId, c));
        }
      } else {
        // Single chapter
        const chapter = parseInt(part, 10);
        if (!isNaN(chapter)) {
          tasks.push(this.getChapterText(bookId, chapter));
        }
      }
    });

    return forkJoin(tasks).pipe(
      map(results => results.join('<hr class="chapter-divider"/>'))
    );
  }

  private getChapterText(bookId: number, chapter: number, verseRange?: string): Observable<string> {
    return this.http.get<BollsVerse[]>(`${this.baseUrl}/get-chapter/${this.translation}/${bookId}/${chapter}/`).pipe(
      map(verses => {
        let filtered = verses;
        
        // Filter verses if range provided
        if (verseRange) {
          if (verseRange.includes('-')) {
            const [vStart, vEnd] = verseRange.split('-').map(Number);
            filtered = verses.filter(v => v.verse >= vStart && v.verse <= vEnd);
          } else {
            // Single verse "1:5" -> though our parser splits on :, so this would just be "5"
            // But usually range is "1-5". If just "5", handle it.
            const vNum = parseInt(verseRange, 10);
            filtered = verses.filter(v => v.verse === vNum);
          }
        }

        return this.formatVersesToHtml(chapter, filtered);
      })
    );
  }

  private formatVersesToHtml(chapter: number, verses: BollsVerse[]): string {
    if (!verses.length) return '';

    let html = `<div class="bolls-chapter mb-6">`;
    html += `<h4 class="chapter-label text-indigo-900 font-bold text-xl mb-3">Chapter ${chapter}</h4>`;
    
    // Heuristic: If a verse contains <br>, it's likely poetry/structure.
    // If not, it's prose.
    // We group consecutive prose verses into <p> tags.
    // We render poetry verses as individual <div> blocks with indentation.
    
    let proseBuffer: string[] = [];
    
    const flushProse = () => {
      if (proseBuffer.length > 0) {
        // Join buffered prose verses with spaces
        html += `<p class="prose-paragraph mb-4 leading-relaxed text-gray-800">${proseBuffer.join(' ')}</p>`;
        proseBuffer = [];
      }
    };

    verses.forEach(v => {
      // Check for structural tags in the text
      const isPoetry = v.text.includes('<br');

      if (isPoetry) {
        // If we switch to poetry, dump any pending prose
        flushProse();
        
        // Render poetry block
        html += `<div class="poetry-block mb-2 pl-4 md:pl-8 text-gray-800 leading-relaxed">
                   <sup class="verse-num font-bold text-indigo-500 text-xs mr-1 align-top select-none">${v.verse}</sup>
                   <span class="verse-text italic">${v.text}</span>
                 </div>`;
      } else {
        // Accumulate prose
        const verseHtml = `<span class="verse-wrapper">
                             <sup class="verse-num font-bold text-indigo-500 text-xs mr-0.5 align-top select-none">${v.verse}</sup>
                             <span class="verse-text">${v.text}</span>
                           </span>`;
        proseBuffer.push(verseHtml);
      }
    });

    // Flush any remaining prose at the end
    flushProse();
    
    html += `</div>`;
    return html;
  }
}