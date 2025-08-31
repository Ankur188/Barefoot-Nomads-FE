import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../services/error.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService, private errorService: ErrorService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loadingService.show(); // Show loader on request start

    return next.handle(req).pipe(
      finalize(() => this.loadingService.hide()),
      catchError((error: HttpErrorResponse) => {
        console.log(11111, error)
        if (
          error.status === 401
        ) {
          // Show popup
          this.errorService.showError(error.error.error);
        }
        else {
          this.errorService.showError("Something went wrong!");
        }
        return throwError(() => error);
      }) // Hide loader when request completes
    );
  }
}
