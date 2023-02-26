import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';

@Injectable()
export class AddHeaderInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedRequest = req.clone({ headers: req.headers.append('Authorization', this.userService.uuid) });

    return next.handle(clonedRequest);
  }
}
