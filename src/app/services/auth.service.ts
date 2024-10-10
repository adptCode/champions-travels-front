import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, User } from '../models/user'
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.apiUrl}/auth`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  isAdmin$ = this.isAdminSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();



  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();
  }

  register(userData: Partial<User>): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData).pipe(
      tap(() => {
        this.router.navigate(['/login']);
      })
    );
  }


  login(credentials: { email: string; password: string }): Observable<{ data: AuthResponse }> {
    return this.http.post<{ data: AuthResponse }>(`${this.baseUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap((response: { data: AuthResponse }) => {
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userName', response.data.user.first_name)
        this.setAuthStatus(token);
        this.currentUserSubject.next(response.data.user);
        const redirectUrl = localStorage.getItem('redirectUrl') || '/home';
        localStorage.removeItem('redirectUrl');
        this.router.navigate([redirectUrl]);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    this.isAuthenticatedSubject.next(false);
    this.isAdminSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  forgotPassword(email: { email: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/forgot-password`, email);
  }

  changePassword(data: { oldPassword: string; newPassword: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/change-password`, data);
  }

  checkAuthStatus(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.setAuthStatus(token);
      this.getCurrentUser().subscribe();
    } else {
      this.isAuthenticatedSubject.next(false);
      this.isAdminSubject.next(false);
      this.currentUserSubject.next(null);
    }
  }

  private setAuthStatus(token: string): void {
    const payload = JSON.parse(atob(token.split('.')[1]));
    this.isAuthenticatedSubject.next(true);
    this.isAdminSubject.next(payload.role === 'admin');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`, { withCredentials: true }).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }
}
