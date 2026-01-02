import { Component, ChangeDetectionStrategy, signal, computed, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { ReadingPlanService } from './services/reading-plan.service';
import { BibleService, ReadingState } from './services/bible.service';
import { Reading } from './models/reading.model';

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
    const day = Math.floor(diff / oneDay);
    // Ensure we don't exceed 365 (e.g. leap year day 366) as our plan is 365 days.
    // In a leap year, day 366 (Dec 31) will just show day 365's readings.
    return Math.min(day > 0 ? day : 1, 365);
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

  getDateLabel(day: number): string {
    // Using a non-leap year (e.g. 2025) to map 1-365 days to Calendar dates
    // Day 1 -> Jan 1, Day 365 -> Dec 31
    const date = new Date(2025, 0, day);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  }
}
