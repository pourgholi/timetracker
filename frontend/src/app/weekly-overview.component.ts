// src/app/weekly-overview.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, WeeklyOverview } from './api.service';

@Component({
  selector: 'app-weekly-overview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe
  ],
  template: `
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">Weekly Overview</h2>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Week starting:
        </label>
        <input
          type="date"
          [(ngModel)]="startDate"
          (change)="load()"
          class="border rounded px-3 py-2"
        />
      </div>

      <div *ngIf="isLoading()" class="text-center py-8 text-gray-500">
        Loading...
      </div>

      <div *ngIf="!isLoading() && dateKeys().length === 0" class="text-center py-8 text-gray-500">
        No entries found for this week.
      </div>

      <table *ngIf="dateKeys().length > 0" class="w-full border-collapse">
        <thead>
        <tr class="bg-gray-100">
          <th class="border p-3 text-left">Date</th>
          <th class="border p-3 text-left">Hours</th>
        </tr>
        </thead>
        <tbody>
        @for (key of dateKeys(); track key) {
        <tr class="hover:bg-gray-50">
          <td class="border p-3">{{ key | date:'EEEE, MMM d, y' }}</td>
              <td class="border p-3">{{ hours()[key] | number:'1.1-2' }} h</td>
            </tr>
        }
        </tbody>
      </table>

      <div *ngIf="!isLoading()" class="mt-4 text-sm text-gray-600">
        Total hours this week: <strong>{{ totalHours() | number:'1.1-2' }} h</strong>
      </div>
    </div>
  `,
  styles: [`
    table { border: 1px solid #e5e7eb; }
    th, td { min-width: 140px; }
  `]
})
export class WeeklyOverviewComponent {

  // State
  startDate = signal<string>(this.getMondayOfCurrentWeek());
  hours = signal<WeeklyOverview>({});
  dateKeys = signal<string[]>([]);
  isLoading = signal<boolean>(false);

  // Injected service
  private api = inject(ApiService);

  constructor() {
    // Load initial data
    this.load();
  }

  load() {
    this.isLoading.set(true);

    // Hardcoded userId = 1 for demo — in real app use auth service/current user
    const userId = 1;

    this.api.getWeeklyOverview(userId, this.startDate()).subscribe({
      next: (data) => {
        this.hours.set(data);

        // Compute sorted keys for consistent display
        const keys = Object.keys(data).sort();
        this.dateKeys.set(keys);

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load weekly overview', err);
        this.isLoading.set(false);
        // You could add user-facing error message here
      }
    });
  }

  // Helper: calculate total hours for display
  totalHours = computed(() => {
    const h = this.hours();
    return Object.values(h).reduce((sum, val) => sum + val, 0);
  });

  // Helper: get Monday of the current week (ISO week)
  private getMondayOfCurrentWeek(): string {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(today.setDate(diff));
    return monday.toISOString().split('T')[0];
  }
}
