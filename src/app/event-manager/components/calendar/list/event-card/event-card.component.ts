import { Component, inject, input, signal } from '@angular/core';
import { Event, EventLight } from '../../../../../core/models/business/event.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { EventService } from '../../../../services/event.service';
import { AuthenticatorService } from '../../../../../core/service/authenticator.service';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';

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
  styleUrl: './event-card.component.scss',
})
export class EventCardComponent {
  eventService = inject(EventService);
  authenticatorService = inject(AuthenticatorService);
  private toastr = inject(ToastrService);

  eventLight = input.required<EventLight>();
  fullEvent = signal<Event | null>(null);

  isLoading = signal(false);
  isLoaded = signal(false);

  onCardOpened(): void {
    if (!this.fullEvent() && !this.isLoading()) {
      this.isLoading.set(true);

      this.eventService.getEventById(this.eventLight().id).subscribe({
        next: (data) => {
          this.fullEvent.set(data);
          this.isLoading.set(false);
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

    this.eventService.participate(event.id, user.id).pipe(
      tap((saved) => {
        this.isLoading.set(false);
        if (saved) {
          this.toastr.success('Inscription a l\'évènement ' + event.name, 'Success');
        } else {
          this.toastr.error('Echec de l\'inscription.', 'Error');
        }
      }),
    ).subscribe();
  }

  onUnregister(e: MouseEvent): void {
    e.stopPropagation(); 
    this.isLoading.set(true);
    const user = this.authenticatorService.user();
    const event = this.fullEvent();

    if (!user || !event) {return;}

    this.eventService.cancel(event.id, user.id).pipe(
      tap((saved) => {
        this.isLoading.set(false);
        //if (saved) {
          this.toastr.success('Désinscription a l\'évènement ' + event.name, 'Success');
        //} else {
        //  this.toastr.error('Echec de la désinscription.', 'Error');
        //}
      }),
    ).subscribe();
  }

  compareDates(): boolean {
    const d1 = new Date(this.eventLight().startDate);
    const d2 = new Date(this.eventLight().endDate);
    
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    
    return d1.getTime() === d2.getTime();
  }
}
