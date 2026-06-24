import { Component, computed, inject } from '@angular/core';
import { UserFormComponent } from "../user-form/user-form.component";
import { UsersService } from '../../../services/users.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AuthenticatorService } from '../../../../core/service/authenticator.service';
import { User } from '../../../../core/models/business/user.model';

@Component({
  selector: 'app-update-user',
  imports: [UserFormComponent, MatProgressSpinner],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss',
})
export class UpdateUserComponent {
  private usersService = inject(UsersService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private authService = inject(AuthenticatorService);

  selectedUser = computed(() => this.authService.user());

  loading = false;

  updateProfile(user: User) {
    this.usersService
      .updateUser(user.id, user)
      .pipe(
        tap((saved) => {
          this.loading = false;
          if (saved) {
            this.toastr.success('Profil mis à jour avec succés !', 'Success');
            this.router.navigateByUrl('/event-manager/profile');
          } else {
            this.toastr.error('Echec de la mis à jour.', 'Error');
          }
        }),
      ).subscribe();
  }
}
