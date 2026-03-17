import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../core/models/user.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../core/models/page.model';
import { RoleEnum } from '../../core/models/role.enum';

@Injectable()
export class UsersService {
    private http = inject(HttpClient);

    getUsers(page: number, size: number): Observable<Page<User>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', "id");
        return this.http.get<Page<User>>(`${environment.apiUrl}/users`, { params: params, withCredentials: true });
    }

    updateUser(id: number, value: User): Observable<User> {
        
        return this.http.put<User>(`${environment.apiUrl}/user/${id}`, value, { withCredentials: true });
    }

    updateRoleUser(id: number, value: RoleEnum): Observable<User> {
        const params = new HttpParams()
            .set('role', value);
        return this.http.put<User>(`${environment.apiUrl}/user/role/${id}`, null, { params: params, withCredentials: true });
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

    deleteUser(id: number): Observable<User> {
        return this.http.delete<User>(`${environment.apiUrl}/user/${id}`, { withCredentials: true });
    }
    
}