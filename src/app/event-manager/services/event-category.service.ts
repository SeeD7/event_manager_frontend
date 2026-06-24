import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Page } from '../../core/models/page.model';
import { Observable } from 'rxjs';
import { EventCategory } from '../../core/models/business/event-category.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class EventCategoryService {
  
  private http = inject(HttpClient);
  private route = "/event-category"

  getEventCategories(page: number, size: number): Observable<Page<EventCategory>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', "id");
    return this.http.get<Page<EventCategory>>(`${environment.apiUrl}${this.route}/paged`, { params: params, withCredentials: true });
  }

  getEventCategoryById(id: number): Observable<EventCategory> {
    return this.http.get<EventCategory>(`${environment.apiUrl}${this.route}/${id}`);
  }

  getEventCategoryByName(name: string): Observable<EventCategory> {
    const params = new HttpParams().set('name', name);
    return this.http.get<EventCategory>(`${environment.apiUrl}${this.route}/name`, { params, withCredentials: true });
  }
  exists(name: string): Observable<boolean> {
    const params = new HttpParams().set('name', name);
    return this.http.get<boolean>(`${environment.apiUrl}${this.route}/exists`, { params, withCredentials: true });
  }

  createEventCategory(value: EventCategory): Observable<EventCategory> {
    return this.http.post<EventCategory>(`${environment.apiUrl}${this.route}`, value, { withCredentials: true });
  }   
  
  deleteEventCategory(id: number): Observable<EventCategory> {
          return this.http.delete<EventCategory>(`${environment.apiUrl}${this.route}/${id}`, { withCredentials: true });
  }

  updateEventCategory(id: number, value: EventCategory): Observable<EventCategory> {
    return this.http.put<EventCategory>(`${environment.apiUrl}${this.route}/${id}`, value, { withCredentials: true });
  }
  
}
