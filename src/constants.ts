import { environment } from "./environments/environment";

export enum ActionType {
  Create,
  Edit,
  Delete
}

export class Endpoints {
  public static getTodos: string = `${environment.serverUrl}/todo`;
  public static newTodo: string = this.getTodos;
  public static updateTodo: string = this.getTodos;
  public static deleteTodo: string = this.getTodos;
  public static lockTodo: string = `${this.getTodos}/lock`;
}
