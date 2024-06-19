import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) { }

  getUser(): Observable<any> {
    console.log("Fetching user data");
    return this.http.get<any>(this.baseUrl, { withCredentials: true });
  }

  updateUser(data: any): Observable<any> {
    console.log("Updating user data", data);
    return this.http.patch<any>(this.baseUrl, data, { withCredentials: true });
  }

  uploadPhoto(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    console.log("Uploading photo", file.name);
    return this.http.post<any>(`${this.baseUrl}/upload-photo`, formData, { withCredentials: true });
  }

  deletePhoto(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete-photo`, { withCredentials: true });
  }

  addPreference(teamName: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/preferences`, { team_name: teamName }, { withCredentials: true });
  }

  removePreference(teamName: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/preferences`, {
      body: { team_name: teamName },
      withCredentials: true
    });
  }
}
