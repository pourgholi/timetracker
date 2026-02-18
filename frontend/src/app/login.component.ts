import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 class="text-2xl mb-6 text-center">Login</h2>
      <form (ngSubmit)="login()">
        <input [(ngModel)]="credentials.username" name="username" placeholder="Username" required class="w-full p-2 mb-4 border rounded" />
        <input type="password" [(ngModel)]="credentials.password" name="password" placeholder="Password" required class="w-full p-2 mb-4 border rounded" />
        <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
      </form>
      <p *ngIf="error" class="mt-4 text-red-600 text-center">{{ error }}</p>
    </div>
  `
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.credentials).subscribe({
      next: () => this.router.navigate(['/daily']),
      error: err => this.error = err.message || 'Login failed'
    });
  }
}
