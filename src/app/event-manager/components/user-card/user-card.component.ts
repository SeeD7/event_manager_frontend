import { Component, OnInit, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-card',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent implements OnInit {

  user = input.required<User>();
  editableRole = input<boolean>(false);
  roleChange = output<string>();

  ngOnInit(): void {
  }

  onSubmitForm() {
  }
}
