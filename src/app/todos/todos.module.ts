import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosComponent } from './pages/todos/todos.component';
import { TodoComponent } from './components/todo/todo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from "@angular/material/dialog";
import { DialogComponent } from './components/dialog/dialog.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    TodosComponent,
    TodoComponent,
    DialogComponent
  ],
  imports: [
    MatSnackBarModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatDialogModule,
    FormsModule,
    CommonModule
  ]
})
export class TodosModule { }
