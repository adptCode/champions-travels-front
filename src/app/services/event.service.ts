import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event, EventParticipation } from '../models/event';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private baseUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) { }

  getEvents(): Observable<{ data: Event[] }> {
    return this.http.get<{ data: Event[] }>(`${this.baseUrl}`, { withCredentials: true });
  }

  getEventById(id: number): Observable<{ data: Event }> {
    return this.http.get<{ data: Event }>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  addEvent(event: Partial<Event>): Observable<{ data: Event }> {
    return this.http.post<{ data: Event }>(`${this.baseUrl}`, event, { withCredentials: true });
  }

  updateEvent(id: number, event:  Partial<Event>): Observable<{ data: Event }> {
    return this.http.patch<{ data: Event }>(`${this.baseUrl}/${id}`, event, { withCredentials: true });
  }

  deleteEvent(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  uploadPhoto(id: number, formData: FormData): Observable<{ data: { photo: string } }> {
    return this.http.patch<{ data: { photo: string } }>(`${this.baseUrl}/${id}/upload-photo`, formData, { withCredentials: true });
  }

  deletePhoto(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}/delete-photo`, { withCredentials: true });
  }

  getParticipants(id: number): Observable<{ data: EventParticipation[] }> {
    return this.http.get<{ data: EventParticipation[] }>(`${this.baseUrl}/${id}/participants`, { withCredentials: true });
  }

  participate(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/${id}/participate`, {}, { withCredentials: true });
  }

  leaveEvent(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}/leave`, { withCredentials: true });
  }
}
