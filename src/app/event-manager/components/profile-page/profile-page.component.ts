import { Component, computed, inject } from '@angular/core';
import { AuthenticatorService } from '../../../core/service/authenticator.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  imports: [RouterLink],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  
  private authService = inject(AuthenticatorService);

  user = computed(() => this.authService.user());

}
