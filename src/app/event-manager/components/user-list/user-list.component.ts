import { Component, OnInit, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-list',
  imports: [AsyncPipe, MatCardModule, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent  implements OnInit {
  private route = inject(ActivatedRoute);

  users$!: Observable<User[]>;

  ngOnInit(): void {
    this.users$ = this.route.data.pipe(
      map(data => data['users'])
    );
  }
}