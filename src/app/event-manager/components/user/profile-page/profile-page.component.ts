import { Component, computed, inject } from '@angular/core';
import { AuthenticatorService } from '../../../../core/service/authenticator.service';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, catchError, EMPTY, filter, finalize, of, switchMap, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../../services/users.service';
import { ChangePasswordModalComponent } from '../../modal/change-password-modal/change-password-modal.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { UserEventTableComponent } from '../../event/user-event-list/user-event-table.component';
import { EventService } from '../../../services/event.service';
import { Event } from '../../../../core/models/business/event.model';
import { CancelConfirmModalComponent } from '../../../../shared/component/cancel-confirm-modal/cancel-confirm-modal.component';
import { SearchEvent } from '../../../../core/models/search/search-event.model';
import { EventStateEnum } from '../../../../core/models/business/event-state.enum';

@Component({
  selector: 'app-profile-page',
  imports: [RouterLink, UserEventTableComponent, MatProgressSpinner, AsyncPipe],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  private dialog = inject(MatDialog);
  private authService = inject(AuthenticatorService);
  private usersService = inject(UsersService);
  private eventService = inject(EventService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  user = computed(() => this.authService.user());

  pageIndex = 0;
  pageSize = 10;
  search = new SearchEvent();

  private refresh$ = new BehaviorSubject<void>(undefined);

  event$ = this.refresh$.pipe(
    switchMap(() =>
      this.eventService.getEventPaged(this.search, this.pageIndex, this.pageSize)
    )
  );

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  ngOnInit(): void {
    this.search.state = [EventStateEnum.DRAFT,EventStateEnum.PUBLISHED];
    this.loadEvents();
  }

  changePassword() {
    this.dialog.open(ChangePasswordModalComponent, {
      height: '370px',
      width: '750px',
    }).afterClosed()
    .pipe(
      filter((password): password is string => !!password),
      switchMap(password => {
        const user = this.user();
        if (!user) {
          throw new Error('User should not be null here');
        }
        return this.usersService.updatePassword(user.id, password);
      }),
      tap(() => this.toastr.success('Mot de passe mis à jour avec succés !', 'Success')),
      catchError(err => {
        this.toastr.error('Echec de la mis à jour.' + err, 'Error');
        return EMPTY; // 🔥 empêche le stream de casser
      })
    )
    .subscribe();
  }

  editRow(event: Event): void {
    this.router.navigateByUrl(`/event-manager/events/edit/${event.id}`);
  }
  
  deleteRow(event: Event) {
    this.loadingSubject.next(true);
        this.dialog.open(CancelConfirmModalComponent, {
          data: { text: `Êtes vous sur de vouloir supprimer l'évènement "${event.name}" ?`,
                  validate: "Oui",
                  cancel: "Non" ,
                  validateClass: "danger" },
          height: '200px',
          width: '500px',
        }).afterClosed()
        .pipe(
          switchMap(value => value ? this.eventService.deleteEvent(event.id) : of(null)),
          finalize(() => this.loadingSubject.next(false))
        ).subscribe(() => {
          this.refresh$.next();
        });
  }

  loadFromChild(value: {search: SearchEvent, pageIndex: number, pageSize: number}){
    this.search = value.search;
    this.pageIndex = value.pageIndex;
    this.pageSize = value.pageSize;
    this.loadEvents();
  }

  loadEvents() {
    this.refresh$.next();
  }
}
