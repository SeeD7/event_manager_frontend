import { Component, Input, OnChanges, output, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { User } from '../../../../core/models/user.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Page } from '../../../../core/models/page.model';
import { RoleEnum } from '../../../../core/models/role.enum';
import { CommonModule } from '@angular/common';
import { PageInfo } from '../../../../core/models/page-info.model';

@Component({
  selector: 'app-users-table',
  imports: [MatTableModule, MatPaginator, MatButtonModule, MatIcon, CommonModule],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss'
})
export class UsersTableComponent implements OnChanges {
  @Input() pageUser!: Page<User>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnChanges() {
    if (this.pageUser) {
      this.dataSource = [...this.pageUser.content];
      this.pageInfo = {...this.pageUser.page};
    queueMicrotask(() => {
      if (!this.paginator) return;
        this.paginator.length = this.pageUser.page.totalElements;
        this.paginator.pageIndex = this.pageUser.page.number;
        this.paginator.pageSize = this.pageUser.page.size;
      });
    }
  }

  dataSource: User[] = [];
  pageInfo: PageInfo = {
    number: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  };

  edit = output<User>();
  delete = output<User>();
  loadUsers = output<{ pageIndex: number, pageSize: number }>();

  roles = RoleEnum;

  columnsToDisplay = ['firstName', 'lastName', 'username', 'role', 'email', 'actions'];
  headersColumns = ['Prénom', 'Nom', 'Nom d\'utilisateur', 'Rôle', 'Email'];

  onPageChange(event: PageEvent) {
    this.loadUsers.emit({pageIndex: event.pageIndex, pageSize:event.pageSize});
  }
}
