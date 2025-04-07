import { AfterContentInit, ChangeDetectorRef, Component, Input, NgZone, ViewChild } from "@angular/core";
import { SwiperComponent } from "swiper/angular";
import SwiperCore , {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
} from 'swiper';
import { BehaviorSubject } from "rxjs";
import { StaticService } from "src/services/static.service";
import { Router } from "@angular/router";


SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller
]);


@Component({
  selector: 'trip-carousel',
  templateUrl: './trip-carousel.component.html',
  styleUrls: ['./trip-carousel.component.scss']
})


export class TripCarouselComponent implements AfterContentInit {

  tripsList = [{name: 'ALL', selected: true},{name: 'kashmir', selected: false},{name: 'himachal', selected: false},{name: 'uttrakhand', selected: false},{name: 'north-east', selected: false},{name: 'tailor-made', selected: false},]
  trips:any[]  = [];
  cardWidth = 352; // Adjust based on your card width and margin
  currentIndex = 0;
  visibleCards  // Number of cards visible at a time
  slideOffset = 0;

  constructor (public staticService: StaticService, private router: Router) {    
    this.staticService.getTrips().subscribe(data => {
      this.trips = data.trips;
    })
  }


  
  ngOnInit() {
    console.log(111, this.visibleCards)
  }

  ngAfterContentInit(): void {
  }
  
  next() {
    this.visibleCards = document.getElementById('slider-main').offsetWidth / this.cardWidth;
    console.log(this.visibleCards)
      if (this.currentIndex + 1 < this.trips.length - this.visibleCards ) {
        this.currentIndex++;
        this.slideOffset = -this.currentIndex * this.cardWidth;
      }
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.slideOffset = -this.currentIndex * this.cardWidth;
    }
  }

  navigateToTrip(trip) {
    this.router.navigate([`trip/${trip.id}`]);
  }

}
