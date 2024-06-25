import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private baseUrl = 'http://localhost:3000/events';

  constructor(private http: HttpClient) { }

  getEvents(): Observable<any> {
    return this.http.get(`${this.baseUrl}`, { withCredentials: true });
  }

  getEventById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  addEvent(event: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, event, { withCredentials: true });
  }

  updateEvent(id: number, event: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, event, { withCredentials: true });
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  uploadPhoto(id: number, formData: FormData): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/upload-photo`, formData, { withCredentials: true });
  }

  deletePhoto(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}/delete-photo`, { withCredentials: true });
  }

  getParticipants(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}/participants`, { withCredentials: true });
  }

  participate(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/participate`, {}, { withCredentials: true });
  }

  leaveEvent(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}/leave`, { withCredentials: true });
  }
}
