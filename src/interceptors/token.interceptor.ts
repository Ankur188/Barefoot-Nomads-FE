import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get the JWT token from sessionStorage
    const accessToken = sessionStorage.getItem('bn_access');
    
    // Add token to request
    const authReq = this.addToken(req, accessToken);

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          // Check if this is the refresh token endpoint itself failing
          const isRefreshTokenEndpoint = req.url.includes('refresh-token') || req.url.includes('refreshToken');
          
          if (isRefreshTokenEndpoint) {
            // Only logout on authentication errors (401/403), not server errors (500, 502, etc.)
            if (error.status === 401 || error.status === 403) {
              console.log('Refresh token authentication failed with', error.status, '- Logging out user');
              this.isRefreshing = false;
              this.refreshTokenSubject.next(null);
              this.logoutAndRedirect();
              return throwError(() => error);
            } else {
              // Server error (500, 502, etc.) - don't logout, just fail the refresh attempt
              console.warn('Refresh token API server error:', error.status, '- Not logging out user');
              this.isRefreshing = false;
              this.refreshTokenSubject.next(null);
              return throwError(() => error);
            }
          }
          
          // For non-refresh endpoints, handle 401/403 with token refresh attempt
          if (error.status === 401 || error.status === 403) {
            return this.handle403Error(authReq, next);
          }
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string | null): HttpRequest<any> {
    const nfSign = environment['x-nf-sign'];
    let headers: any = {};

    // Add user access token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Add production token for Netlify
    if (nfSign && environment.production) {
      headers['x-nf-sign'] = nfSign;
    }

    // Clone the request and add headers if any exist
    if (Object.keys(headers).length > 0) {
      return request.clone({
        setHeaders: headers
      });
    }

    return request;
  }

  private handle403Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = sessionStorage.getItem('bn_refresh');

      if (refreshToken) {
        return this.authService.refreshToken().pipe(
          switchMap((response: any) => {
            this.isRefreshing = false;
            
            if (response && response.tokens) {
              // Update tokens in sessionStorage
              sessionStorage.setItem('bn_access', response.tokens.accessToken);
              sessionStorage.setItem('bn_refresh', response.tokens.refreshToken);
              
              this.refreshTokenSubject.next(response.tokens.accessToken);
              
              // Retry the original request with new token
              return next.handle(this.addToken(request, response.tokens.accessToken));
            }
            
            // If refresh failed, logout user and redirect to login
            this.logoutAndRedirect();
            return throwError(() => new Error('Token refresh failed'));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(null);
            
            // Check if error is 403 from refresh token endpoint
            if (err instanceof HttpErrorResponse && err.status === 403) {
              console.log('Refresh token expired or invalid (403). Redirecting to login...');
            } else if (err instanceof HttpErrorResponse && err.status === 401) {
              console.log('Refresh token unauthorized (401). Redirecting to login...');
            } else {
              console.log('Refresh token failed with error:', err.status || 'unknown');
            }
            
            this.logoutAndRedirect();
            return throwError(() => err);
          })
        );
      } else {
        // No refresh token available, logout user and redirect to login
        this.isRefreshing = false;
        this.logoutAndRedirect();
        return throwError(() => new Error('No refresh token available'));
      }
    } else {
      // Wait for token refresh to complete
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          // If token is still null after filter, it means refresh failed
          if (!token) {
            return throwError(() => new Error('Token refresh failed'));
          }
          return next.handle(this.addToken(request, token));
        })
      );
    }
  }

  private logoutAndRedirect(): void {
    // Reset the refreshing state
    this.isRefreshing = false;
    
    // Save current route to redirect back after login
    const currentUrl = this.router.url;
    
    // Don't redirect back to login page itself
    const returnUrl = currentUrl !== '/login' ? currentUrl : '/';
    
    // Clear all auth data using AuthService method
    this.authService.clearAuthData();
    
    // Redirect to login with returnUrl to redirect back after successful login
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: returnUrl },
      replaceUrl: true // Replace the current URL in history to prevent back button issues
    });
  }
}
