import { Component } from '@angular/core';
import { ErrorService } from '../../services/error.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class ErrorPopupComponent {
  constructor(public errorService: ErrorService) {
    console.log(222222)
  }
}
