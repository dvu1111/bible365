import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, startWith } from 'rxjs/operators';

interface BibleApiResponse {
  reference: string;
  verses: { book_id: string; book_name: string; chapter: number; verse: number; text: string; }[];
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
}

// FIX: Export the ReadingState interface to be used in other files.
export interface ReadingState {
  title: string;
  reference: string;
  content: {
    value?: { text: string; reference: string; };
    loading: boolean;
    error?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BibleService {
  private http = inject(HttpClient);
  private baseUrl = 'https://bible-api.com/';

  fetchVerse(reference: string, title: string = ''): Observable<ReadingState> {
    if (!reference) {
      return of({ title, reference, content: { loading: false } });
    }

    // Sanitize reference for URL and add verse_numbers parameter
    const sanitizedReference = reference.trim().replace(/\s/g, '+');
    const url = `${this.baseUrl}${sanitizedReference}?translation=dra&verse_numbers=true`;

    return this.http.get<BibleApiResponse>(url).pipe(
      map(response => {
        // Construct text with superscript verse numbers
        const verseText = response.verses
          .map(v => `<sup>${v.verse}</sup>&nbsp;${v.text.trim()}`)
          .join(' ');

        return {
          title,
          reference,
          content: {
            value: { text: verseText, reference: response.reference },
            loading: false,
          }
        };
      }),
      catchError(error => of({
        title,
        reference,
        content: {
          loading: false,
          error: `Could not load scripture for "${reference}". Please check the reference or try again later.`
        }
      })),
      startWith({ title, reference, content: { loading: true } })
    );
  }
}