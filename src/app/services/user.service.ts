import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Preference, User } from '../models/user';
import { EventParticipation } from '../models/event';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) { }

  getUser(): Observable<{ data: User }> {
    console.log("Fetching user data");
    return this.http.get<{ data: User }>(this.baseUrl, { withCredentials: true });
  }

  getUserById(id: number): Observable<{ data: User }> {
    return this.http.get<{ data: User }>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  getUserEvents(id: number): Observable<{ data: EventParticipation[] }> {
    return this.http.get<{ data: EventParticipation[] }>(`${this.baseUrl}/${id}/events`, { withCredentials: true });
  }

  updateUser(data: Partial<User>): Observable<{ data: User }> {
    console.log("Updating user data", data);
    return this.http.patch<{ data: User }>(this.baseUrl, data, { withCredentials: true });
  }

  uploadPhoto(file: File): Observable<{ data: { profile_picture: string } }> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    console.log("Uploading photo", file.name);
    return this.http.post<{ data: { profile_picture: string } }>(`${this.baseUrl}/upload-photo`, formData, { withCredentials: true });
  }

  deletePhoto(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/delete-photo`, { withCredentials: true });
  }

  addPreference(teamName: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/preferences`, { team_name: teamName }, { withCredentials: true });
  }

  removePreference(teamName: string): Observable<{ data: Preference }> {
    return this.http.delete<{ data: Preference }>(`${this.baseUrl}/preferences`, {
      body: { team_name: teamName },
      withCredentials: true
    });
  }

  removeUserFromEvent(userId: number, eventId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${userId}/events/${eventId}`, { withCredentials: true });
  }
}
