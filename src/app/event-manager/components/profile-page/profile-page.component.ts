import { Component, computed, inject } from '@angular/core';
import { AuthenticatorService } from '../../../core/service/authenticator.service';
import { UserCardComponent } from "../user-card/user-card.component";

@Component({
  selector: 'app-profile-page',
  imports: [UserCardComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  
  private authService = inject(AuthenticatorService);

  user = computed(() => this.authService.user());

}
