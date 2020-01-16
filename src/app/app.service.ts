import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from './todo.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private readonly apiUrl = '/api';

  constructor(private http: HttpClient) { }

  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(`${this.apiUrl}/todo`, todo);
  }

  removeTodo(todoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/todo/${todoId}`);
  }

  updateTodo(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/todo`, todo);
  }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}/todos`);
  }
}
