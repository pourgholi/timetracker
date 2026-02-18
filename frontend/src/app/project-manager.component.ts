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
      <h2 class="text-2xl font-bold mb-4">Manage Projects</h2>

      <form (ngSubmit)="create()" class="mb-6 space-y-4">
        <input
          [(ngModel)]="newProject.name"
          name="name"
          placeholder="Project Name"
          required
          class="w-full p-2 border rounded"
        />
        <input
          type="number"
          [(ngModel)]="newProject.budgetHours"
          name="budgetHours"
          placeholder="Budget Hours"
          class="w-full p-2 border rounded"
        />
        <input
          type="number"
          [(ngModel)]="newProject.budgetCost"
          name="budgetCost"
          placeholder="Budget Cost"
          class="w-full p-2 border rounded"
        />
        <input
          type="number"
          [(ngModel)]="newProject.hourlyRate"
          name="hourlyRate"
          placeholder="Hourly Rate (optional)"
          class="w-full p-2 border rounded"
        />
        <button
          type="submit"
          class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Project
        </button>
      </form>

      <ul class="space-y-3">
        @for (proj of projects(); track proj.id) {
        <li class="p-3 bg-gray-50 border rounded">
          <strong>{{ proj.name }}</strong>
            <span class="ml-2 text-gray-700">
              Budget: {{ proj.budgetHours }} h /
        {{ proj.budgetCost | currency:'USD' }}
        </span>
      </li>
        }
        @empty {
        <li class="text-gray-500 text-center py-4">
          No projects yet.
        </li>
        }
      </ul>
    </div>
  `,
  styles: []
})
export class ProjectManagerComponent {
  projects = signal<Project[]>([]);
  newProject: Project = {
    id: 0,
    name: '',
    budgetHours: 0,
    budgetCost: 0
  };

  constructor(private api: ApiService) {
    this.api.getProjects().subscribe(p => this.projects.set(p));
  }

  create() {
    this.api.createProject(this.newProject).subscribe({
      next: (newProj) => {
        this.projects.update(projects => [...projects, newProj]);
        this.newProject = {
          id: 0,
          name: '',
          budgetHours: 0,
          budgetCost: 0
        };
      },
      error: (err) => console.error('Create project failed:', err)
    });
  }
}
