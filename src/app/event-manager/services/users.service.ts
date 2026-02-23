import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../core/models/user.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable()
export class UsersService {
    private http = inject(HttpClient);

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${environment.apiUrl}/users`, { withCredentials: true });
    }

    getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${environment.apiUrl}/user/${id}`);
    }

    getUserByEmail(mail: string): Observable<User> {
        return this.http.get<User>(`${environment.apiUrl}/user/email/${mail}`);
    }

    createUser(value: User): Observable<User> {
        return this.http.post<User>(`${environment.apiUrl}/user`, value);
    }

    checkEmail(mail: string): Observable<boolean> {
        const params = new HttpParams().set('email', mail);
        return this.http.get<boolean>(`${environment.apiUrl}/user/exists`, { params });
    }

    checkUsername(username: string): Observable<boolean> {
        const params = new HttpParams().set('username', username);
        return this.http.get<boolean>(`${environment.apiUrl}/user/exists`, { params });
    }
    
}