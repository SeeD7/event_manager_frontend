import { Injectable, inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { UsersService } from '../services/users.service';
import { Observable } from 'rxjs';
import { User } from '../../core/models/user.model';

@Injectable()
export class UsersResolver implements Resolve<User[]> {
  private usersService = inject(UsersService);

  resolve(): Observable<User[]> {
    return this.usersService.getUsers();
  }
}