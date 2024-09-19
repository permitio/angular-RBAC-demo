import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Task } from '@models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [
    { id: 1, name: 'Task 1', finished: false },
    { id: 2, name: 'Task 2', finished: false },
  ];
  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  addTask(name: string): void {
    const newTask: Task = {
      id: this.tasks.length + 1,
      name: name,
      finished: false
    };
    this.tasks.push(newTask);
    this.tasksSubject.next([...this.tasks]);
  }

  toggleTask(id: number): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.finished = !task.finished;
      this.tasksSubject.next([...this.tasks]);
    }
  }

  removeTask(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.tasksSubject.next([...this.tasks]);
  }
}