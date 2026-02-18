import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ← ADD THIS
import { ApiService } from './api.service';

@Component({
  selector: 'app-monthly-overview',
  standalone: true,
  imports: [CommonModule, FormsModule], // ← ADD FormsModule here
  template: `
    <div class="p-4">
      <h2>Monthly Overview</h2>
      <input type="number" [(ngModel)]="year" placeholder="Year" (change)="load()" />
      <input type="number" [(ngModel)]="month" placeholder="Month" min="1" max="12" (change)="load()" />
      <p>Total Hours: {{ total() }}</p>
    </div>
  `,
})
export class MonthlyOverviewComponent {
  year = new Date().getFullYear();
  month = new Date().getMonth() + 1;
  total = signal(0);

  constructor(private api: ApiService) {
    this.load();
  }

  load() {
    this.api.getMonthlyOverview(1, this.year, this.month).subscribe(t => this.total.set(t));
  }
}
