import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Observable } from 'rxjs';

import { AbilityModule } from '@casl/angular';
import { Ability } from '@casl/ability'

import { loadUserAbilities, UserRole, users } from '@services/auth.service';
import { TaskService } from '@services/task.service';
import { Task } from '@models/task';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    AbilityModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  newTaskName = '';
  tasks$: Observable<Task[]>;
  selectedUser: UserRole = "editor";
  loading = false;

  constructor(private taskService: TaskService, private abilityService: Ability) {
    this.tasks$ = this.taskService.getTasks();
  }

  ngOnInit(): void {
    this.loadAbilities();
  }

  userChanged() {
    this.loadAbilities();
  }

  async loadAbilities() {
    this.loading = true;
    const loggedInUser = users[this.selectedUser].email;
    try {
      const ability = await loadUserAbilities(loggedInUser);
      this.abilityService.update(ability);
      this.loading = false;
    } catch (error) {
      alert(error);
    }
  }

  addTask(): void {
    if (this.newTaskName.trim()) {
      this.taskService.addTask(this.newTaskName);
      this.newTaskName = '';
    }
  }

  toggleTask(id: number): void {
    this.taskService.toggleTask(id);
  }

  removeTask(id: number): void {
    this.taskService.removeTask(id);
  }
}
