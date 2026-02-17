import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./core/components/header/header";
import { AuthenticatorService } from './core/service/authenticator.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private authenticatorService = inject(AuthenticatorService);

  protected readonly title = signal('event-manager-frontend');
  
  constructor(){
    this.authenticatorService.checkSession();
  }
}
