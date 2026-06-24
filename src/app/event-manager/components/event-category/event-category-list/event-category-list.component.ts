import { Component, OnInit, computed, inject } from '@angular/core';
import { EventCategoryTableComponent } from "../event-category-table/event-category-table.component";
import { MatDialog } from '@angular/material/dialog';
import { CancelConfirmModalComponent } from '../../../../shared/component/cancel-confirm-modal/cancel-confirm-modal.component';
import { BehaviorSubject, catchError, EMPTY, filter, finalize, of, switchMap, tap } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { EventCategoryService } from '../../../services/event-category.service';
import { EventCategory } from '../../../../core/models/business/event-category.model';
import { EventCategoryModalComponent } from '../event-category-modal/event-category-modal.component';
import { ToastrService } from 'ngx-toastr';
import { AuthenticatorService } from '../../../../core/service/authenticator.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-event-category-list',
  imports: [EventCategoryTableComponent, MatProgressSpinner, AsyncPipe, MatIcon],
  templateUrl: './event-category-list.component.html',
  styleUrl: './event-category-list.component.scss',
})
export class EventCategoryListComponent implements OnInit {
  private service = inject(EventCategoryService);
  private dialog = inject(MatDialog);
  private toastr = inject(ToastrService);
  private authService = inject(AuthenticatorService);

  user = computed(() => this.authService.user());

  pageIndex = 0;
  pageSize = 10;

  private refresh$ = new BehaviorSubject<void>(undefined);

  eventCategories$ = this.refresh$.pipe(
    switchMap(() =>
      this.service.getEventCategories(this.pageIndex, this.pageSize)
    )
  );

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  ngOnInit(): void {
    this.loadEventCategories();
  }

  onCreateCategory(): void {
    this.dialog.open(EventCategoryModalComponent, {
      height: '370px',
      width: '750px',
    }).afterClosed()
    .pipe(
      filter((value): value is EventCategory => !!value),
      switchMap(value => {
        const user = this.user();
        if (!user) {
          throw new Error('User should not be null here');
        }
        value.creator = user.username;
        return this.service.createEventCategory(value);
      }),
      tap(() => this.toastr.success('Catégorie créée avec succés !', 'Success')),
      catchError(err => {
        this.toastr.error('Echec de la mis à jour.' + err, 'Error');
        return EMPTY; // 🔥 empêche le stream de casser
      })
    )
    .subscribe(() => this.refresh$.next());
  }

  editRow(category: EventCategory): void {
    this.dialog.open(EventCategoryModalComponent, {
      data: category,
      height: '370px',
      width: '750px',
    }).afterClosed()
    .pipe(
      filter((value): value is EventCategory => !!value),
      switchMap(value => {
        const user = this.user();
        if (!user) {
          throw new Error('User should not be null here');
        }
        value.creator = user.username;
        return this.service.updateEventCategory(category.id, value);
      }),
      tap(() => this.toastr.success('Catégorie mise à jour avec succés !', 'Success')),
      catchError(err => {
        this.toastr.error('Echec de la mis à jour.' + err, 'Error');
        return EMPTY; // 🔥 empêche le stream de casser
      })
    )
    .subscribe(() => this.refresh$.next());
  }

  deleteRow(category: EventCategory) {
    this.loadingSubject.next(true);
    this.dialog.open(CancelConfirmModalComponent, {
      data: { text: `Êtes vous sur de vouloir supprimer la categorie ${category.name} ?`,
              validate: "Oui",
              cancel: "Non" ,
              validateClass: "danger" },
      height: '160px',
      width: '450px',
    }).afterClosed()
    .pipe(
      switchMap(value => value ? this.service.deleteEventCategory(category.id) : of(null)),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(() => {
      this.refresh$.next();
    });
  }

  loadFromChild(value: {pageIndex: number, pageSize: number}){
    this.pageIndex = value.pageIndex;
    this.pageSize = value.pageSize;
    this.loadEventCategories();
  }

  loadEventCategories() {
    this.refresh$.next();
  }
}