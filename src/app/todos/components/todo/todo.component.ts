import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { todo } from 'src/app/entities';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.less']
})
export class TodoComponent implements OnInit {

  @Input() todo: todo | undefined;
  @Output() todoClick: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  public onTodoClick(): void {
    this.todoClick.emit(this.todo?.id);
  }
}
