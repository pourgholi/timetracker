// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment'; // ← we'll add this next

// Define types for better safety
interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  password: string;
  defaultHourlyRate?: number;
}

interface AuthResponse {
  token: string;
  // add user info later if backend returns more (id, username, role...)
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';
  private currentUserSubject = new BehaviorSubject<string | null>(this.getToken());

  // Public observable — components can subscribe to know login state
  isLoggedIn$ = this.currentUserSubject.asObservable().pipe(
    map(token => !!token)
  );

  private baseUrl = environment.apiUrl + '/auth'; // ← use environment

  constructor(private http: HttpClient) {
    // Optional: validate token on app start (e.g. expired?)
  }

  register(user: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user).pipe(
      catchError(error => {
        console.error('Registration failed', error);
        return throwError(() => new Error(error.error?.message || 'Registration failed'));
      })
    );
  }

  login(credentials: LoginCredentials): Observable<string> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials).pipe(
      map(response => response.token),
      tap(token => {
        localStorage.setItem(this.TOKEN_KEY, token);
        this.currentUserSubject.next(token);
      }),
      catchError(error => {
        console.error('Login failed', error);
        return throwError(() => new Error(error.error?.message || 'Invalid credentials'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Optional: get current token as observable (for guards/interceptors)
  getCurrentToken(): Observable<string | null> {
    return this.currentUserSubject.asObservable();
  }
}
