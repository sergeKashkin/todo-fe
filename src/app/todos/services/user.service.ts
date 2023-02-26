import { Injectable } from "@angular/core";
import * as uuid from "uuid";

export interface IUserService {
  uuid: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService implements IUserService {

  private _uuid: string | null;

  constructor() {
    this._uuid = localStorage.getItem("uuid");
    if (!this._uuid) {
      this.generateNewUuid();
    }
  }

  public get uuid(): string {
    if (!this._uuid) {
      this.generateNewUuid();
    }
    return this._uuid as string;
  }

  private generateNewUuid(): void {
    let id: string = uuid.v4();
    localStorage.setItem("uuid", id);
    this._uuid = id;
  }
}
