import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { ActionType } from 'src/constants';

export interface dialogData {
  id: string | undefined;
  name: string;
  description: string;
  isCompleted: boolean;
  actionType: ActionType;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.less']
})
export class DialogComponent implements OnInit {

  @Output() error: EventEmitter<void> = new EventEmitter<void>();

  public form: FormGroup | undefined;
  public description: string | undefined;
  public name: string | undefined;
  public isCompleted: boolean = false;
  public title: string = "";
  public id: string | undefined;

  private _actionType: ActionType = ActionType.Create;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
      this.description = data.description;
      this.name = data.name;
      this.title = data.title;
      this.isCompleted = data.isCompleted;
      this.id = data.id;
      this._actionType = data.actionType;
    }

  public ngOnInit(): void {
    this.form = this.fb.group({
      description: [this.description, []],
      name: [this.name, []],
      isCompleted: [this.isCompleted, []]
    });
  }

  public save(): void {
    if (!this.form?.value.name?.length || !this.form?.value.description?.length) {
      this.error.emit();
    }
    else {
      this.dialogRef.close({...this.form!.value, id: this.id, actionType: this._actionType});
    }
  }

  public close(): void {
      this.dialogRef.close();
  }

  public delete(): void {
    this.dialogRef.close({...this.form?.value, id: this.id, actionType: ActionType.Delete});
  }
}
