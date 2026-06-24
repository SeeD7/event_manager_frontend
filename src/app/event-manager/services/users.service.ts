import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../core/models/page.model';
import { User } from '../../core/models/business/user.model';
import { SearchUser } from '../../core/models/search/search.user.model';
import { RoleEnum } from '../../core/models/business/role.enum';

@Injectable()
export class UsersService {
    private http = inject(HttpClient);

    getUsers(search: SearchUser, page: number, size: number): Observable<Page<User>> {
        console.log("On viens ici avec un search : " + search);
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', "id");
        if (search) {
        Object.entries(search).forEach(([key, value]) => {
            // On n'ajoute que si la valeur n'est pas vide/null
            if (value !== null && value !== undefined && value !== '') {
                params = params.set(key, value.toString());
            }
        });
    }
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

    updatePassword(id: number, password: string): Observable<User> {
        const params = new HttpParams()
            .set('password', password);
        return this.http.put<User>(`${environment.apiUrl}/user/password/${id}`, null, { params: params, withCredentials: true });
    }
    
}