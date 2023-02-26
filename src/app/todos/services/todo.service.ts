import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { todo } from 'src/app/entities';
import { Endpoints } from 'src/constants';
import { UserService } from './user.service';

interface serverTodo {
  createdAt: string;
  description: string;
  isCompleted: boolean;
  isInEdit: boolean;
  name: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

export interface ITodoService {
  openedTodo: string | null;

  loadTodos(): Observable<todo[]>;
  createTodo(name: string, description: string): Observable<todo>;
  deleteTodo(id: string): Observable<string>;
  updateTodo(todo: todo): Observable<todo>;
  lockTodo(id: string): Observable<todo>;
}
@Injectable({
  providedIn: 'root'
})
export class TodoService implements ITodoService {
  private _openedTodo: string | null;

  constructor(private httpClient: HttpClient) {
    this._openedTodo = null;
  }

  public get openedTodo(): string | null {
    return this._openedTodo;
  }

  public set openedTodo(id: string | null) {
    this._openedTodo = id;
  }

  public loadTodo(id: string): Observable<todo> {
    return this.httpClient.get<serverTodo>(`${Endpoints.getTodos}/${id}`).pipe(
      map((todo: serverTodo) => {
        return {
          description: todo.description,
          name: todo.name,
          id: todo._id,
          isCompleted: todo.isCompleted,
          isInEdit: todo.isInEdit
        };
      })
    );
  }

  public loadTodos(): Observable<todo[]> {
    return this.httpClient.get<serverTodo[]>(Endpoints.getTodos).pipe(
      map((todos) => todos.map((todo: serverTodo) => {
        return {
          id: todo._id,
          description: todo.description,
          isCompleted: todo.isCompleted,
          isInEdit: todo.isInEdit,
          name: todo.name
        }
      }))
    );
  }

  public createTodo(name: string, description: string): Observable<todo> {
    return this.httpClient.post<serverTodo>(Endpoints.newTodo, {name, description}).pipe(
      map((todo) => {
        return {
          id: todo._id,
          description: todo.description,
          isCompleted: todo.isCompleted,
          isInEdit: todo.isInEdit,
          name: todo.name
        } as todo
      })
    );
  }

  public deleteTodo(id: string): Observable<string> {
    return this.httpClient.delete<string>(`${Endpoints.deleteTodo}/${id}`);
  }

  public updateTodo(todo: todo): Observable<todo> {
    return this.httpClient.put<serverTodo>(`${Endpoints.updateTodo}/${todo.id}`, {...todo}).pipe(
      map((todo) => {
        return {
          id: todo._id,
          description: todo.description,
          isCompleted: todo.isCompleted,
          isInEdit: todo.isInEdit,
          name: todo.name
        };
      })
    );
  }

  public lockTodo(id: string): Observable<todo> {
    return this.httpClient.post<todo>(`${Endpoints.lockTodo}/${id}`, {});
  }

  public unlockTodo(id: string): Observable<todo> {
    return this.httpClient.delete<todo>(`${Endpoints.lockTodo}/${id}`);
  }
}
