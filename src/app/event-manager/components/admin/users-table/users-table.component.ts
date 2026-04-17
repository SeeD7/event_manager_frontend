import { Component, inject, Input, OnChanges, OnDestroy, output, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { User } from '../../../../core/models/user.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Page } from '../../../../core/models/page.model';
import { RoleEnum } from '../../../../core/models/role.enum';
import { CommonModule } from '@angular/common';
import { PageInfo } from '../../../../core/models/page-info.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { SearchUser } from '../../../../core/models/search.user.model';

@Component({
  selector: 'app-users-table',
  imports: [ReactiveFormsModule, MatTableModule, MatPaginator, MatButtonModule, MatIcon, CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCardModule],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss'
})
export class UsersTableComponent implements OnChanges, OnDestroy {
  dataSource: User[] = [];
  pageInfo: PageInfo = {
    number: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  };

  edit = output<User>();
  delete = output<User>();
  loadUsers = output<{search: SearchUser, pageIndex: number, pageSize: number }>();

  roles = RoleEnum;
  public roleOptions = Object.values(RoleEnum);

  columnsToDisplay = ['firstName', 'lastName', 'username', 'role', 'email', 'actions'];
  
  private formBuilder = inject(FormBuilder);
  @Input() pageUser!: Page<User>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  mainForm!: FormGroup;

  firstNameCtrl!: FormControl;
  lastNameCtrl!: FormControl;
  usernameCtrl!: FormControl;
  roleCtrl!: FormControl;
  emailCtrl!: FormControl;
  
  private obs!: Subscription;

  ngOnInit(): void {
    this.firstNameCtrl = this.formBuilder.control("");
    this.lastNameCtrl = this.formBuilder.control("");
    this.usernameCtrl = this.formBuilder.control("");
    this.roleCtrl = this.formBuilder.control("");
    this.emailCtrl = this.formBuilder.control("");

    this.mainForm = this.formBuilder.group({
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl,
      username: this.usernameCtrl,
      role: this.roleCtrl,
      email: this.emailCtrl,
    });

    this.obs = this.mainForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe(data => {
        this.loadUsers.emit({search: this.mainForm.value ,pageIndex: 0, pageSize: 10});
      });
  }

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

  ngOnDestroy(): void {
    // Always unsubscribe to prevent memory leaks
    if (this.obs) {
      this.obs.unsubscribe();
    }
  }

  onPageChange(event: PageEvent) {
    this.loadUsers.emit({search: this.mainForm.value ,pageIndex: event.pageIndex, pageSize: event.pageSize});
  }
}
