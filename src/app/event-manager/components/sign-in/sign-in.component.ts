import { Component, inject } from '@angular/core';
import { tap } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { User } from '../../../core/models/user.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-sign-in',
  imports: [UserFormComponent, MatProgressSpinner],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  private usersService = inject(UsersService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  loading = false;

  createProfile(user: User) {
    this.loading = true;
    
    this.usersService
      .createUser(user)
      .pipe(
        tap((saved) => {
          this.loading = false;
          if (saved) {
            this.toastr.success('Inscription réussie ! Bienvenue !', 'Success');
            this.router.navigateByUrl('/event-manager/auth/login');
          } else {
            this.toastr.error('Echec de l\'inscription.', 'Error');
          }
        }),
      ).subscribe();
  }
}
