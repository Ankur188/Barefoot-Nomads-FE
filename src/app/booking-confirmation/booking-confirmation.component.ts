import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.scss']
})
export class BookingConfirmationComponent implements OnInit {

  constructor() { }
  loadingGif: string = 'assets/your-loading.gif';
  gifCompleted: boolean = false;

  ngOnInit(): void {}

  onGifEnd(): void {
    this.gifCompleted = true;
  }

  onGifLoad(): void {
    const gifElement = document.querySelector('img') as HTMLImageElement;

    if (gifElement) {
      // Set a timeout to change the state when the gif finishes
      const gifDuration = 1200; // Set this to the duration of your GIF in milliseconds
      setTimeout(() => {
        this.gifCompleted = true;
      }, gifDuration);
    }
  }

}
