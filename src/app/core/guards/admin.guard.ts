import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticatorService } from '../service/authenticator.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  private auth = inject(AuthenticatorService);
  private router = inject(Router);

  canActivate(): boolean {
    if (this.auth.user() && this.auth.user()?.role === "ADMIN") {
      return true;
    } else {
      this.router.navigateByUrl('/');
      return false;
    }
  }
}