import { Component, inject, input, signal, ChangeDetectionStrategy, computed, ChangeDetectorRef } from '@angular/core';
import { Event, EventLight } from '../../../../../core/models/business/event.model';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { EventService } from '../../../../services/event.service';
import { AuthenticatorService } from '../../../../../core/service/authenticator.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-event-card',
  imports: [CommonModule,
    MatExpansionModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule],
  templateUrl: './event-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './event-card.component.scss',
})
export class EventCardComponent {
  private eventService = inject(EventService);
  private authenticatorService = inject(AuthenticatorService);
  private toastr = inject(ToastrService);
  private cd = inject(ChangeDetectorRef);

  eventLight = input.required<EventLight>();
  fullEvent = signal<Event | null>(null);

  isLoading = signal(false);
  isLoaded = signal(false);

  participants = computed(() => {
    const full = this.fullEvent();
    return full ? full.participants.length : this.eventLight().participants;
  });

  waitingList = computed(() => {
    const full = this.fullEvent();
    return full ? full.waitingList.length : this.eventLight().waitingList;
  });

  onCardOpened(): void {
    if (!this.fullEvent() && !this.isLoading()) {
      this.isLoading.set(true);

      this.eventService.getEventById(this.eventLight().id).subscribe({
        next: (data) => {
          this.fullEvent.set(data);
          this.isLoading.set(false);
          this.cd.markForCheck();
        },
        error: () => this.isLoading.set(false)
      });
    }
  }

  onRegister(e: MouseEvent): void {
    e.stopPropagation();
    this.isLoading.set(true);
    const user = this.authenticatorService.user();
    const event = this.fullEvent();

    if (!user || !event) {return;}

    this.eventService.participate(event.id, user.id).subscribe({
        next: (data) => {
          this.fullEvent.set({ ...data });
          this.isLoading.set(false);
          this.toastr.success('Inscription a l\'évènement ' + event.name, 'Success');
          this.cd.markForCheck();
        },
        error: () => {
          this.isLoading.set(false);
          this.toastr.error('Echec de l\'inscription.', 'Error');
        }
      });
  }

  onUnregister(e: MouseEvent): void {
    e.stopPropagation();
    this.isLoading.set(true);
    const user = this.authenticatorService.user();
    const event = this.fullEvent();

    if (!user || !event) {return;}

    this.eventService.cancel(event.id, user.id).subscribe({
        next: (data) => {
          this.fullEvent.set({ ...data });
          this.isLoading.set(false);
          this.toastr.success('Désinscription a l\'évènement ' + event.name, 'Success');
          this.cd.markForCheck();
        },
        error: () => {
          this.isLoading.set(false);
          this.toastr.error('Echec de la désinscription.', 'Error');
        }
      });
  }

  compareDates(): boolean {
    const d1 = new Date(this.eventLight().startDate);
    const d2 = new Date(this.eventLight().endDate);

    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    return d1.getTime() === d2.getTime();
  }
}
