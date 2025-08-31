import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from 'src/services/booking.service';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.scss']
})
export class BookingConfirmationComponent implements OnInit {

  tripId = '';
  bookingId = '';
  booking: any;
  constructor(private activatedRoute: ActivatedRoute, private bookingService: BookingService) { 
    this.tripId = this .activatedRoute.snapshot.paramMap.get('id');
    this.bookingId = this .activatedRoute.snapshot.paramMap.get('bookingId');
    this.bookingService.getBookingDetails(this.bookingId).subscribe(data => {
      this.booking = data;
    })
  }
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
