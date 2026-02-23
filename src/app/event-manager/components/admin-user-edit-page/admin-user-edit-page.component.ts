import { Component } from '@angular/core';
import { UserCardComponent } from "../user-card/user-card.component";
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-user-edit-page',
  imports: [UserCardComponent],
  templateUrl: './admin-user-edit-page.component.html',
  styleUrl: './admin-user-edit-page.component.scss',
})
export class AdminUserEditPageComponent {

  selectedUser!: User;

  updateRole($event: string) {
  
  }

}
