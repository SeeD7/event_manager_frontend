import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { AuthenticatorService } from '../../../core/service/authenticator.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-front-page',
  imports: [CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './front-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './front-page.component.scss',
})
export class FrontPageComponent {
  authenticatorService = inject(AuthenticatorService);
}
