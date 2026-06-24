import { Component, OnInit, inject } from '@angular/core';
import { UsersTableComponent } from "../users-table/users-table.component";
import { MatDialog } from '@angular/material/dialog';
import { CancelConfirmModalComponent } from '../../../../shared/component/cancel-confirm-modal/cancel-confirm-modal.component';
import { UpdateRoleModalComponent } from '../update-role-modal/update-role-modal.component';
import { UsersService } from '../../../services/users.service';
import { BehaviorSubject, finalize, of, switchMap } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { SearchUser } from '../../../../core/models/search/search.user.model';
import { User } from '../../../../core/models/business/user.model';
import { RoleEnum } from '../../../../core/models/business/role.enum';

@Component({
  selector: 'app-user-list',
  imports: [UsersTableComponent, MatProgressSpinner, AsyncPipe],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private dialog = inject(MatDialog);
  private usersService = inject(UsersService);

  pageIndex = 0;
  pageSize = 10;
  search = new SearchUser();

  private refresh$ = new BehaviorSubject<void>(undefined);

  users$ = this.refresh$.pipe(
    switchMap(() =>
      this.usersService.getUsers(this.search, this.pageIndex, this.pageSize)
    )
  );

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  ngOnInit(): void {
    this.loadUsers();
  }

  editRow(user: User) {
    this.loadingSubject.next(true);
    this.dialog.open(UpdateRoleModalComponent, {
      data: user,
      height: '300px',
      width: '650px',
    }).afterClosed()
    .pipe(
      switchMap((role: RoleEnum | undefined) => role !== undefined ? this.usersService.updateRoleUser(user.id, role) : of(null)),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(() => {
      this.refresh$.next();
    });
  }

  deleteRow(user: User) {
    this.loadingSubject.next(true);
    this.dialog.open(CancelConfirmModalComponent, {
      data: { text: `Êtes vous sur de vouloir supprimer l'utilisateur ${user.username} ?`,
              validate: "Oui",
              cancel: "Non" ,
              validateClass: "danger" },
      height: '160px',
      width: '450px',
    }).afterClosed()
    .pipe(
      switchMap(value => value ? this.usersService.deleteUser(user.id) : of(null)),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(() => {
      this.refresh$.next();
    });
  }

  loadFromChild(value: {search: SearchUser, pageIndex: number, pageSize: number}){
    this.search = value.search;
    this.pageIndex = value.pageIndex;
    this.pageSize = value.pageSize;
    this.loadUsers();
  }

  loadUsers() {
    this.refresh$.next();
  }
}