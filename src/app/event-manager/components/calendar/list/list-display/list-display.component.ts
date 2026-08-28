import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DateSelectorComponent } from "../date-selector/date-selector.component";
import { BehaviorSubject, groupBy, map, mergeMap, switchMap, tap, zip } from 'rxjs';
import { EventService } from '../../../../services/event.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { EventCardComponent } from "../event-card/event-card.component";
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-list-display',
  imports: [DateSelectorComponent, AsyncPipe, MatProgressSpinner, EventCardComponent, MatCardModule],
  templateUrl: './list-display.component.html',
  styleUrl: './list-display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListDisplayComponent {
  eventService = inject(EventService);

  datePipe = new DatePipe("fr");

  currentDate = signal(new Date);
  displayType = signal<number>(1);

  listOfDays = signal<Date[]>([])

  private refresh$ = new BehaviorSubject<void>(undefined);

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  ngOnInit(): void {
    this.loadEvents();
  }

  events$ = this.refresh$.pipe(
    switchMap(() => this.eventService.getEventList(this.displayType(), this.currentDate())),
    map(events => Map.groupBy(events,({ startDate }) => this.datePipe.transform(startDate, "yyyy-MM-dd"))),
    tap(events => console.log(JSON.stringify(events)))
  );

  onDateChanged($event: Date) {
    this.currentDate.set($event);
    this.loadEvents();
  }

  displayTypeChanged($event: number) {
    this.displayType.set($event);
    this.loadEvents();
  }

  loadEvents() {
    this.refresh$.next();
  }
}
