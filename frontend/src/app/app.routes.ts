import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { DailyTrackerComponent } from './daily-tracker.component';
import { WeeklyOverviewComponent } from './weekly-overview.component';
import { MonthlyOverviewComponent } from './monthly-overview.component';
import { ProjectManagerComponent } from './project-manager.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'daily', component: DailyTrackerComponent },
  { path: 'weekly', component: WeeklyOverviewComponent },
  { path: 'monthly', component: MonthlyOverviewComponent },
  { path: 'projects', component: ProjectManagerComponent },
  { path: '', redirectTo: '/daily', pathMatch: 'full' },
];
