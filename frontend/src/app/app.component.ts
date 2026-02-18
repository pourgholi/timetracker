import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <nav class="flex space-x-4 p-4 bg-gray-200">
      <a routerLink="/login">Login</a>
      <a routerLink="/daily">Daily Entry</a>
      <a routerLink="/weekly">Weekly</a>
      <a routerLink="/monthly">Monthly</a>
      <a routerLink="/projects">Projects</a>
      <button (click)="auth.logout()">Logout</button>
    </nav>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}
