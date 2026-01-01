// FIX: Import Signal and remove unused effect
import { Component, ChangeDetectionStrategy, signal, computed, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
// FIX: Import toObservable for reactive signals
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
// FIX: Remove unused 'of' from rxjs
import { switchMap } from 'rxjs';

import { ReadingPlanService } from './services/reading-plan.service';
// FIX: Import BibleService and the ReadingState interface
import { BibleService, ReadingState } from './services/bible.service';
import { Reading } from './models/reading.model';

// FIX: Removed redundant ReadingContent interface, will use ReadingState from bible.service

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class AppComponent {
  private readingPlanService = inject(ReadingPlanService);
  private bibleService = inject(BibleService);
  
  private getDayOfYear(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  days = Array.from({ length: 365 }, (_, i) => i + 1);
  selectedDay = signal<number>(this.getDayOfYear());
  
  currentReading = computed<Reading | undefined>(() => {
    return this.readingPlanService.getReadingForDay(this.selectedDay());
  });

  private fetchReading(title: string, referenceSignal: Signal<string | undefined>): Signal<ReadingState | undefined> {
    return toSignal(
      toObservable(referenceSignal).pipe(
        switchMap(ref => this.bibleService.fetchVerse(ref || '', title))
      )
    );
  }

  firstReadingRef = computed(() => this.currentReading()?.firstReading);
  firstReading = this.fetchReading('First Reading', this.firstReadingRef);
  
  secondReadingRef = computed(() => this.currentReading()?.secondReading);
  secondReading = this.fetchReading('Second Reading', this.secondReadingRef);

  psalmRef = computed(() => this.currentReading()?.psalmProverbs);
  psalm = this.fetchReading('Psalm / Proverbs', this.psalmRef);

  onDayChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedDay.set(Number(selectElement.value));
  }
}