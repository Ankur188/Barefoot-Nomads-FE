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
    // Check if request should skip loader
    const skipLoader = req.headers.has('X-Skip-Loader');
    
    // Remove the custom header before sending the request
    const newReq = skipLoader ? req.clone({
      headers: req.headers.delete('X-Skip-Loader')
    }) : req;

    if (!skipLoader) {
      this.loadingService.show(); // Show loader on request start
    }

    return next.handle(newReq).pipe(
      finalize(() => {
        if (!skipLoader) {
          this.loadingService.hide();
        }
      }),
      catchError((error: HttpErrorResponse) => {
        const isRefreshTokenEndpoint = req.url.includes('refresh-token') || req.url.includes('refreshToken');

        if (!isRefreshTokenEndpoint) {
          this.errorService.showHttpError(error, req.url);
        }

        return throwError(() => error);
      }) // Hide loader when request completes
    );
  }
}
