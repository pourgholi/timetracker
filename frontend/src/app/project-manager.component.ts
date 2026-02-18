import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

interface Project {
  id: number;
  name: string;
  budgetHours: number;
  budgetCost: number;
  hourlyRate?: number;
}

@Component({
  selector: 'app-project-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4">
      <h2>Manage Projects</h2>
      <form (ngSubmit)="create()">
        <input [(ngModel)]="newProject.name" name="name" placeholder="Name" required />
        <input type="number" [(ngModel)]="newProject.budgetHours" name="budgetHours" placeholder="Budget Hours" />
        <input type="number" [(ngModel)]="newProject.budgetCost" name="budgetCost" placeholder="Budget Cost" />
        <input type="number" [(ngModel)]="newProject.hourlyRate" name="hourlyRate" placeholder="Hourly Rate (optional)" />
        <button type="submit">Add Project</button>
      </form>

      <ul>
        @for (proj of projects(); track proj.id) {
        <li>
        {{ proj.name }} - Budget: {{ proj.budgetHours }}h / ${{ proj.budgetCost }}
          </li>
        }
      </ul>
    </div>
  `,
})
export class ProjectManagerComponent {
  projects = signal<Project[]>([]);
  newProject: Project = { id: 0, name: '', budgetHours: 0, budgetCost: 0 };

  constructor(private api: ApiService) {
    this.api.getProjects().subscribe(p => this.projects.set(p));
  }

  create() {
    // Use proper POST method from ApiService (add this method there)
    this.api.createProject(this.newProject).subscribe(newProj => {
      this.projects.update(projects => [...projects, newProj]);
      this.newProject = { id: 0, name: '', budgetHours: 0, budgetCost: 0 };
    });
  }
}
