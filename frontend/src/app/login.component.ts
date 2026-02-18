import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4">
      <h2>Login</h2>
      <form (ngSubmit)="login()">
        <input [(ngModel)]="credentials.username" placeholder="Username" required />
        <input [(ngModel)]="credentials.password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <button (click)="register()">Register</button>
    </div>
  `,
})
export class LoginComponent {
  credentials = { username: '', password: '' };

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.credentials).subscribe(() => this.router.navigate(['/daily']));
  }

  register() {
    this.auth.register(this.credentials).subscribe(() => this.login());
  }
}
