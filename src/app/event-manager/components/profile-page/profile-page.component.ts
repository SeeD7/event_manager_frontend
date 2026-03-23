import { Component, computed, inject } from '@angular/core';
import { AuthenticatorService } from '../../../core/service/authenticator.service';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordModalComponent } from '../modal/change-password-modal/change-password-modal.component';
import { UsersService } from '../../services/users.service';
import { catchError, EMPTY, filter, switchMap, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile-page',
  imports: [RouterLink],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  private dialog = inject(MatDialog);
  private authService = inject(AuthenticatorService);
  private usersService = inject(UsersService);
  private toastr = inject(ToastrService);

  user = computed(() => this.authService.user());

  changePassword() {
    this.dialog.open(ChangePasswordModalComponent, {
      height: '370px',
      width: '750px',
    }).afterClosed()
    .pipe(
      filter((password): password is string => !!password),
      switchMap(password => {
        const user = this.user();
        if (!user) {
          throw new Error('User should not be null here');
        }
        return this.usersService.updatePassword(user.id, password);
      }),
      tap(() => this.toastr.success('Mot de passe mis à jour avec succés !', 'Success')),
      catchError(err => {
        this.toastr.error('Echec de la mis à jour.' + err, 'Error');
        return EMPTY; // 🔥 empêche le stream de casser
      })
    )
    .subscribe();
  }
}
