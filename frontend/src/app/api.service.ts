import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';


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
  date: string;
  hours: number;
}

export interface WeeklyOverview {
  [date: string]: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = '/api';   // relative – proxied by Nginx
  private http = inject(HttpClient);

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects`);
  }

  createProject(project: Omit<Project, 'id'>): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/projects`, project);
  }

  createTimeEntry(entry: Omit<TimeEntry, 'id'>): Observable<TimeEntry> {
    return this.http.post<TimeEntry>(`${this.apiUrl}/time-entries`, entry);
  }

  getWeeklyOverview(userId: number, start: string): Observable<WeeklyOverview> {
    return this.http.get<WeeklyOverview>(`${this.apiUrl}/overviews/weekly`, {
      params: { userId: userId.toString(), start }
    });
  }

  getMonthlyOverview(userId: number, year: number, month: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/overviews/monthly`, {
      params: { userId: userId.toString(), year: year.toString(), month: month.toString() }
    });
  }
}
