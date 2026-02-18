import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  password: string;
  defaultHourlyRate?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private authState = new BehaviorSubject<string | null>(this.getToken());

  isLoggedIn$ = this.authState.asObservable().pipe(
    map(token => !!token)
  );

  private baseUrl = '/auth';  // relative – proxied by Nginx

  constructor(private http: HttpClient) {}

  register(user: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user).pipe(
      catchError(err => throwError(() => new Error(err.error?.message || 'Registration failed')))
    );
  }

  login(credentials: LoginCredentials): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/login`, credentials).pipe(
      tap(token => {
        localStorage.setItem(this.TOKEN_KEY, token);
        this.authState.next(token);
      }),
      catchError(err => throwError(() => new Error(err.error?.message || 'Login failed')))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.authState.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
