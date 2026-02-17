import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { catchError, of, tap } from 'rxjs';
import { User } from '../../core/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticatorService {
  private http = inject(HttpClient);

  private readonly _user = signal<User | null>(null);
  
  readonly user = computed(() => this._user());

  readonly authenticated = computed(() => !!this._user());

  authenticate(
    credentials: { username: string; password: string } | undefined,
    callback?: () => void,
  ): void {
    const body = new URLSearchParams();
    body.set('username', credentials!.username);
    body.set('password', credentials!.password);

    this.http
      .post(`${environment.apiUrl}/authentication`, body.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          this.fetchUser();
          if (callback) {
            callback();
          }
        },
      });
  }

  logout() {
    this._user.set(null);
    this.http.post(`${environment.apiUrl}/logout`, {}, { withCredentials: true })
    .subscribe();
  }

  fetchUser() {
  this.http.get<User>(`${environment.apiUrl}/current-user`, { withCredentials: true })
    .subscribe(user => {
      this._user.set(user);
    });
}

  checkSession() {
    return this.http.get<User>(`${environment.apiUrl}/current-user`, { withCredentials: true }).pipe(
      tap(user => this._user.set(user)),
      catchError(() => {
        this._user.set(null);
        return of(null);
      }),
    ).subscribe();
  }
}
