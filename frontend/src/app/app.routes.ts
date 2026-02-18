import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

import { LoginComponent } from './login.component';
import { DailyTrackerComponent } from './daily-tracker.component';
import { WeeklyOverviewComponent } from './weekly-overview.component';
import { MonthlyOverviewComponent } from './monthly-overview.component';
import { ProjectManagerComponent } from './project-manager.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'daily', component: DailyTrackerComponent, canActivate: [authGuard] },
  { path: 'weekly', component: WeeklyOverviewComponent, canActivate: [authGuard] },
  { path: 'monthly', component: MonthlyOverviewComponent, canActivate: [authGuard] },
  { path: 'projects', component: ProjectManagerComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/daily', pathMatch: 'full' },
  { path: '**', redirectTo: '/daily' }
];
