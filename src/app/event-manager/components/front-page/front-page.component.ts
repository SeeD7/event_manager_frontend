import { Component, inject } from '@angular/core';
import { AuthenticatorService } from '../../../core/service/authenticator.service';

@Component({
  selector: 'app-front-page',
  imports: [],
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.scss',
})
export class FrontPageComponent {
  authenticatorService = inject(AuthenticatorService);
}
