import { Component } from '@angular/core';
import { UserService } from './todos/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public title: string = 'Todoing';

  constructor(private userService: UserService) {
  }
}
