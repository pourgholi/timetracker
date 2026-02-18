import { Component, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ← ADD THIS
import { ApiService, WeeklyOverview } from './api.service';

@Component({
  selector: 'app-weekly-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe], // ← ADD FormsModule
  template: `
    <div class="p-4">
      <h2>Weekly Overview</h2>
      <input type="date" [(ngModel)]="startDate" (change)="load()" />
      <table class="w-full">
        <tr><th>Date</th><th>Hours</th></tr>
        @for (key of dateKeys(); track key) {
        <tr>
          <td>{{ key | date }}</td>
            <td>{{ hours()[key] }}</td>
          </tr>
        }
      </table>
    </div>
  `,
})
export class WeeklyOverviewComponent {
  startDate = signal<string>(new Date().toISOString().split('T')[0]);
  hours = signal<WeeklyOverview>({});
  dateKeys = signal<string[]>([]);

  constructor(private api: ApiService) {
    this.load();
  }

  load() {
    this.api.getWeeklyOverview(1, this.startDate()).subscribe(h => {
      this.hours.set(h);
      this.dateKeys.set(Object.keys(h).sort());
    });
  }
}
