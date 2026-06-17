import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { AuthenticatorService } from '../../service/authenticator.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatToolbarModule, RouterLink, MatIconModule],
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
