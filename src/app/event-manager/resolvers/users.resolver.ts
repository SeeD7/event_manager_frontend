import { Injectable, inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { UsersService } from '../services/users.service';
import { Observable } from 'rxjs';
import { Page } from '../../core/models/page.model';
import { SearchUser } from '../../core/models/search/search.user.model';
import { User } from '../../core/models/business/user.model';

@Injectable()
export class UsersResolver implements Resolve<Page<User>> {
  private usersService = inject(UsersService);

  resolve(): Observable<Page<User>> {
    return this.usersService.getUsers(new SearchUser, 0, 10);
  }
}