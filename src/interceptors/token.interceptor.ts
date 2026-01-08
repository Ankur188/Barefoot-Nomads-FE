import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get the JWT token from localStorage (or a service)
    const token = environment['x-nf-sign']
    console.log('token', environment['x-nf-sign'])

    if (token && environment.production) {
      // Clone the request and add the Authorization header
      const cloned = req.clone({
        setHeaders: {
          'x-nf-sign': token
        }
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
