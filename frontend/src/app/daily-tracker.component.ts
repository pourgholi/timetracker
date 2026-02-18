import { Component, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

@Component({
  selector: 'app-daily-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <div class="p-4">
      <h2>Daily Time Entry</h2>
      <form (ngSubmit)="submit()">
        <label>Date: <input type="date" [(ngModel)]="entry.date" required /></label>
        <label>Project: 
          <select [(ngModel)]="entry.project.id" required>
            @for (proj of projects(); track proj.id) {
              <option [value]="proj.id">{{ proj.name }}</option>
            }
          </select>
        </label>
        <label>Hours: <input type="number" [(ngModel)]="entry.hours" min="0.1" required /></label>
        <button type="submit">Save</button>
      </form>
    </div>
  `,
})
export class DailyTrackerComponent {
  projects = signal<any[]>([]);
  entry = { date: new Date().toISOString().split('T')[0], project: { id: 0 }, hours: 0 };

  constructor(private api: ApiService) {
    this.api.getProjects().subscribe(projects => this.projects.set(projects));
  }

  submit() {
    this.api.createTimeEntry(this.entry).subscribe({
      next: () => alert('Entry saved'),
      error: err => alert('Error: ' + err.error.message)  // Handles budget exceed
    });
  }
}
