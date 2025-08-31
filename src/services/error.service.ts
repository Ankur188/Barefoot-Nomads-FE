import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private errorMessage = new BehaviorSubject<string | null>(null);
  errorMessage$ = this.errorMessage.asObservable();

  showError(message: string) {
    this.errorMessage.next(message);
    console.log('aaaaa')
    // Auto-hide after 3 seconds
    setTimeout(() => {
      console.log('bbbbbbb')
      this.errorMessage.next(null);
    }, 3000);
  }
}
