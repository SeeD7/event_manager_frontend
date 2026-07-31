import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Page } from '../../core/models/page.model';
import { Observable } from 'rxjs';
import { Event, EventForm } from '../../core/models/business/event.model';
import { environment } from '../../../environments/environment.development';
import { SearchEvent } from '../../core/models/search/search-event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  
  private http = inject(HttpClient);
  private route = "/event"

  getEventPaged(search: SearchEvent, page: number, size: number): Observable<Page<Event>> {
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
    return this.http.get<Page<Event>>(`${environment.apiUrl}${this.route}s/page`, { params: params, withCredentials: true });
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${environment.apiUrl}${this.route}/${id}`, { withCredentials: true });
  }

  getEventByName(name: string): Observable<Event> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Event>(`${environment.apiUrl}${this.route}/name`, { params, withCredentials: true });
  }
  exists(name: string): Observable<boolean> {
    const params = new HttpParams().set('name', name);
    return this.http.get<boolean>(`${environment.apiUrl}${this.route}/exists`, { params, withCredentials: true });
  }

  createEvent(value: EventForm): Observable<Event> {
    return this.http.post<Event>(`${environment.apiUrl}${this.route}`, value, { withCredentials: true });
  }   
  
  deleteEvent(id: number): Observable<Event> {
    return this.http.delete<Event>(`${environment.apiUrl}${this.route}/${id}`, { withCredentials: true });
  }

  updateEvent(value: EventForm): Observable<Event> {
    return this.http.put<Event>(`${environment.apiUrl}${this.route}`, value, { withCredentials: true });
  }
  
}
