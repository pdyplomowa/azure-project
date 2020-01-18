import { Component, OnInit } from '@angular/core';
import { Todo } from './todo.model';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  template: `
    <mat-list>
      <mat-progress-spinner [class.hidden]="!isRequesting" [mode]="'indeterminate'" [diameter]="40"></mat-progress-spinner>
      <mat-error *ngIf="error">{{ error }}</mat-error>
      <h3 mat-subheader>Zadania do wykonania</h3>
      <h4 class="no-todos-placeholder">Brak zadań</h4>
      <mat-list-item *ngFor="let todo of todos">
        <div class="list-item-container">
          <ng-container *ngIf="editedTodoId === todo._id">
            <mat-form-field>
              <input matInput [(ngModel)]="editedTodoName">
            </mat-form-field>
            <div class="item-actions">         
              <button mat-stroked-button color="accent" class="item-action-btn" [disabled]="!canProcessTodo(editedTodoName)" (click)="updateTodo()">Zapisz</button>
              <button mat-stroked-button class="item-action-btn" (click)="cancelTodoEdit()">Anuluj</button>
            </div>
          </ng-container>
          <ng-container *ngIf="editedTodoId !== todo._id">
            <h5 class="todo-name">{{ todo.name }}</h5>
            <div class="item-actions">
              <button mat-stroked-button color="primary" class="item-action-btn" (click)="editTodo(todo)">Edytuj</button>
              <button mat-stroked-button color="warn" class="item-action-btn" (click)="deleteTodo(todo._id)">Usuń</button>
            </div>
          </ng-container>
        </div>
      </mat-list-item>
      <h3 mat-subheader>Wprowadź nowe zadanie</h3>
      <div class="add-todo-panel">
        <mat-form-field class="add-todo-form-field">
          <input matInput placeholder="Nazwa zadania" [(ngModel)]="todoName">
        </mat-form-field>
        <div>
          <button mat-flat-button color="primary" [disabled]="!canProcessTodo(todoName)" (click)="addTodo()">
            Dodaj zadanie
          </button>
        </div>
      </div>
    </mat-list>
  `,
  styles: [`
    mat-list {
      max-width: 1080px;
      margin: 200px auto;
    }

    mat-list-item {
      box-shadow: 0px 0px 4px 1px rgba(0,0,0,0.1);
      margin: 6px 0;
    }

    .hidden {
      visibility: hidden;
    }

    mat-progress-spinner {
      margin: 0 auto;
    }

    .add-todo-panel {
      display: flex;
      padding: 0 16px;
      justify-content: space-between;
      align-items: center;
    }

    mat-form-field, .todo-name {
      width: 80%;
    }

    .no-todos-placeholder {
      margin: 0 16px;
    }

    .item-action-btn {
      margin: 0 6px;
    }

    .item-actions {
      margin-left: auto;
    }

    .list-item-container {
       display: flex;
       align-items: center;
       width: 100%;
    }
  `]
})
export class AppComponent implements OnInit {
  editedTodoId: string;
  editedTodoName: string;
  error: string;
  isRequesting = false;
  todoName = '';
  todos: Todo[] = [];

  constructor(private appService: AppService) {
  }

  ngOnInit() {
    this.isRequesting = true;
    this.appService.getTodos().subscribe(
      (todos) => {
        this.todos = todos;
        this.isRequesting = false;
      },
      (err) => {
        this.error = err.message;
        this.isRequesting = false;
      }
    )
  }

  canProcessTodo(todoName: string): boolean {
    return todoName && todoName.trim().length > 0 && todoName.trim().length <= 100 && !this.isRequesting;
  }

  addTodo() {
    if (this.canProcessTodo(this.todoName)) {
      const todoName = this.todoName.trim();
      this.isRequesting = true;
      this.appService.addTodo({ _id: undefined, name: todoName }).subscribe(
        (todo: Todo) => {
          this.todos = [...this.todos, todo];
          this.isRequesting = false;
          this.todoName = '';
        },
        (err) => {
          this.error = err.message;
          this.isRequesting = false;
        }
      );
    }
  }

  editTodo(todo: Todo) {
    this.editedTodoId = todo._id;
    this.editedTodoName = todo.name;
  }

  updateTodo() {
    if (this.canProcessTodo(this.editedTodoName) && this.editedTodoId) {
      const editedTodoName = this.editedTodoName.trim();
      this.isRequesting = true;
      this.appService.updateTodo({ _id: this.editedTodoId, name: editedTodoName }).subscribe(
        (todo: Todo) => {
          const index = this.todos.map((todo) => todo._id).indexOf(todo._id);
          this.todos[index] = todo;
          this.todos = [...this.todos];
          this.isRequesting = false;
          this.editedTodoId = null;
          this.editedTodoName = '';
        },
        (err) => {
          this.error = err.message;
          this.isRequesting = false;
        }
      )
    }
  }

  cancelTodoEdit() {
    this.editedTodoId = null;
    this.editedTodoName = '';
  }

  deleteTodo(todoId: string) {
    this.isRequesting = true;
    this.appService.removeTodo(todoId).subscribe(
      () => {
        this.todos = this.todos.filter((todo) => todo._id !== todoId);
        this.isRequesting = false;
      },
      (err) => {
        this.error = err.message;
        this.isRequesting = false;
      }
    )
  }
}
