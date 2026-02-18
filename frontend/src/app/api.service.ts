// src/app/api.service.ts
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment'; // ← recommended

// ────────────────────────────────────────────────
// Type definitions – improve safety & autocompletion
// ────────────────────────────────────────────────

export interface Project {
  id: number;
  name: string;
  budgetHours: number;
  budgetCost: number;
  hourlyRate?: number;
}

export interface TimeEntry {
  id?: number;
  project: { id: number };
  date: string;           // ISO date string "YYYY-MM-DD"
  hours: number;
  user?: { id: number };  // optional – usually set by backend
}

export interface WeeklyOverview {
  [date: string]: number; // e.g. { "2026-02-16": 8.5, ... }
}

// ────────────────────────────────────────────────

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/api`;   // e.g. http://localhost:8080/api
  private authUrl = `${environment.apiUrl}/auth`;

  // ────────────────────────────────────────────────
  // Projects
  // ────────────────────────────────────────────────

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects`).pipe(
      catchError(this.handleError)
    );
  }

  createProject(project: Omit<Project, 'id'>): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/projects`, project).pipe(
      catchError(this.handleError)
    );
  }

  // Optional – if you need update/delete later
  // updateProject(id: number, project: Partial<Project>): Observable<Project> { ... }
  // deleteProject(id: number): Observable<void> { ... }

  // ────────────────────────────────────────────────
  // Time Entries
  // ────────────────────────────────────────────────

  createTimeEntry(entry: Omit<TimeEntry, 'id' | 'user'>): Observable<TimeEntry> {
    return this.http.post<TimeEntry>(`${this.apiUrl}/time-entries`, entry).pipe(
      catchError(this.handleError)
    );
  }

  // Optional: get entries with filters
  // getTimeEntries(params: { userId?: number; start?: string; end?: string }): Observable<TimeEntry[]> { ... }

  // ────────────────────────────────────────────────
  // Overviews
  // ────────────────────────────────────────────────

  getWeeklyOverview(userId: number, startDate: string): Observable<WeeklyOverview> {
    return this.http.get<WeeklyOverview>(`${this.apiUrl}/overviews/weekly`, {
      params: { userId: userId.toString(), start: startDate }
    }).pipe(
      catchError(this.handleError)
    );
  }

  getMonthlyOverview(userId: number, year: number, month: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/overviews/monthly`, {
      params: {
        userId: userId.toString(),
        year: year.toString(),
        month: month.toString()
      }
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ────────────────────────────────────────────────
  // Auth endpoints (optional – can be moved to AuthService later)
  // ────────────────────────────────────────────────

  login(credentials: { username: string; password: string }): Observable<string> {
    return this.http.post<string>(`${this.authUrl}/login`, credentials).pipe(
      catchError(this.handleError)
    );
  }

  register(user: { username: string; password: string; defaultHourlyRate?: number }): Observable<any> {
    return this.http.post(`${this.authUrl}/register`, user).pipe(
      catchError(this.handleError)
    );
  }

  // ────────────────────────────────────────────────
  // Error handling (centralized)
  // ────────────────────────────────────────────────

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Server returned code: ${error.status}, body: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
