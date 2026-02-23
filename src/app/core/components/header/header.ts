import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { AuthenticatorService } from '../../service/authenticator.service';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  authenticatorService = inject(AuthenticatorService);
  router = inject(Router);

  logout() {
    this.authenticatorService.logout();
    this.router.navigateByUrl('/');
  }
}
