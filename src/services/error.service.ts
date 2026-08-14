import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private errorMessage = new BehaviorSubject<string | null>(null);
  errorMessage$ = this.errorMessage.asObservable();
  private hideTimeoutId: ReturnType<typeof setTimeout> | null = null;

  showError(message: string) {
    this.errorMessage.next(message);
    if (this.hideTimeoutId) {
      clearTimeout(this.hideTimeoutId);
    }

    this.hideTimeoutId = setTimeout(() => {
      this.errorMessage.next(null);
      this.hideTimeoutId = null;
    }, 3000);
  }

  showHttpError(error: HttpErrorResponse, requestUrl?: string) {
    this.showError(this.getUserFriendlyMessage(error, requestUrl));
  }

  private getUserFriendlyMessage(error: HttpErrorResponse, requestUrl?: string): string {
    const rawMessage = this.extractRawMessage(error);
    const normalizedUrl = (requestUrl || '').toLowerCase();
    const normalizedMessage = rawMessage.toLowerCase();

    if (normalizedUrl.includes('/user/login')) {
      if (error.status === 401 || normalizedMessage.includes('incorrect password') || normalizedMessage.includes('email does not exist')) {
        return 'Invalid email or password.';
      }
    }

    if (normalizedUrl.includes('/users/signup')) {
      if (normalizedMessage.includes('duplicate key value') || normalizedMessage.includes('already exists')) {
        return 'An account with this email already exists.';
      }
    }

    if (normalizedMessage.includes('jwt secret') || normalizedMessage.includes('secretorprivatekey')) {
      return 'Login is temporarily unavailable. Please try again in a moment.';
    }

    if (normalizedMessage.includes('jwt expired') || normalizedMessage.includes('token expired')) {
      return 'Your session has expired. Please log in again.';
    }

    if (normalizedMessage.includes('no refresh token') || normalizedMessage.includes('jwt malformed') || normalizedMessage.includes('invalid token')) {
      return 'Your session is no longer valid. Please log in again.';
    }

    if (normalizedMessage.includes('duplicate key value')) {
      return 'This record already exists.';
    }

    if (error.status === 0) {
      return 'Unable to reach the server. Please check your connection and try again.';
    }

    if (error.status >= 500) {
      return 'Something went wrong on our side. Please try again.';
    }

    if (error.status === 403) {
      return 'You are not allowed to do that right now.';
    }

    if (error.status === 404) {
      return 'We could not find what you were looking for.';
    }

    if (error.status === 400) {
      return rawMessage || 'Please check your details and try again.';
    }

    return rawMessage || 'Something went wrong. Please try again.';
  }

  private extractRawMessage(error: HttpErrorResponse): string {
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error.trim();
    }

    if (error.error?.error && typeof error.error.error === 'string') {
      return error.error.error.trim();
    }

    if (error.error?.message && typeof error.error.message === 'string') {
      return error.error.message.trim();
    }

    if (typeof error.message === 'string') {
      return error.message.trim();
    }

    return '';
  }
}
