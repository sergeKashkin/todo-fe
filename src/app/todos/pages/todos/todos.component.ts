import { Component, HostListener, OnInit } from '@angular/core';
import { todo } from 'src/app/entities';
import { TodoService } from '../../services/todo.service';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DialogComponent, dialogData } from '../../components/dialog/dialog.component';
import { ActionType } from 'src/constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentCanDeactivate } from '../../guards/candeactivate.guard';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.less']
})
export class TodosComponent implements OnInit, ComponentCanDeactivate {

  constructor(private todoService: TodoService, private dialog: MatDialog, private snack: MatSnackBar) { }

  @HostListener('window:beforeunload')
  async canDeactivate(): Promise<boolean> {
    if (this.todoService.openedTodo) {
      await firstValueFrom(this.todoService.unlockTodo(this.todoService.openedTodo));
      return true;
    }
    else {
      return true;
    }
  }

  public ActionType = ActionType;
  public todos: todo[] = [];

  public ngOnInit(): void {
    this.initialize();
  }

  public onActionClick(id: string | undefined = undefined, actionType: ActionType): void {
    if (id) {
      this.todoService.lockTodo(id).subscribe(() => {
        this.handleAction(id, actionType);
      }, (error) => {
        this.snack.open("This task is edited by another user, try again later", "ok");
      });
    }
    else {
      this.handleAction(id, actionType);
    }
  }

  public async handleAction(id: string | undefined = undefined, actionType: ActionType): Promise<void> {
    let potentialEdit = {name: "", description: ""} as todo | undefined;

    if (id) {
      // clicked on existing todo - edit it
      let potentialEditIndex: number = this.todos.findIndex((todo: todo) => todo.id === id);
      potentialEdit = this.todos.find((todo: todo) => todo.id === id);
      try {
        let todo: todo = await firstValueFrom(this.todoService.loadTodo(id));
        if (todo?.id) {
          this.todos[potentialEditIndex] = todo;
          potentialEdit = todo;
          this.todoService.openedTodo = id;
        }
        else {
          this.snack.open("Opps, something went wrong.", "ok", {duration: 2500});
          return;
        }
      }
      catch (e) {
        console.error(e);
      }

    }

    let ref: MatDialogRef<DialogComponent> = this.dialog.open(DialogComponent, {disableClose: true, autoFocus: true, hasBackdrop: true, data: {name: potentialEdit?.name, description: potentialEdit?.description, isCompleted: potentialEdit?.isCompleted, id: potentialEdit?.id ,potentialEdit, actionType, title: "New Task"}});
    ref.componentInstance.error.subscribe(() => {
      this.snack.open("Name & Description cannot be empty", "Ok", {duration: 3000});
    });

    let sub = ref.afterClosed().subscribe(async (data: dialogData) => {
      sub.unsubscribe();
      this.todoService.openedTodo = null;
      if (data) {
        if (data.id) {

          if (data.actionType === ActionType.Delete) {
            this.deleteTodo(data.id);
          }
          else {
            this.updateTodo({...potentialEdit, name: data.name, description: data.description, isCompleted: data.isCompleted} as todo);
            this.todoService.unlockTodo(data.id).subscribe(() => {
              this.snack.open("Succesffully edited a todo", "ok", {duration: 2500});
            });
          }

        }
        else {
          this.createTodo(data.name, data.description);
        }
      }
      else if (potentialEdit?.id) {
        await firstValueFrom(this.todoService.unlockTodo(potentialEdit.id))
      }
      else {
        this.initialize();
      }
    });
  }

  private initialize(): void {
    this.todoService.loadTodos().subscribe((todos: todo[]) => {
      this.todos = todos.sort((a, b) => {
        if (a.isCompleted && !b.isCompleted) {
          return -1;
        }
        else if (!a.isCompleted && b.isCompleted) {
          return 1;
        }
        else {
          return 0;
        }
      });
    }, (error) => {
      console.error(error);
    });
  }

  private createTodo(name: string, description: string): void {
    this.todoService.createTodo(name, description).subscribe(() => {
      this.initialize();
    }, (error) => {
      console.error(error);
    });
  }

  private deleteTodo(id: string): void {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.initialize();
    }, (error) => {
      console.error(error);
    });
  }

  private updateTodo(todo: todo): void {
    this.todoService.updateTodo(todo).subscribe(() => {
      this.initialize();
    }, (error) => {
      console.error(error);
    });
  }
}
