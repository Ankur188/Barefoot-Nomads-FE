// import { AfterContentInit, ChangeDetectorRef, Component, Input, NgZone, ViewChild } from "@angular/core";
// import { SwiperComponent } from "swiper/angular";
// import SwiperCore , {
//   Navigation,
//   Pagination,
//   Scrollbar,
//   A11y,
//   Virtual,
//   Zoom,
//   Autoplay,
//   Thumbs,
//   Controller,
// } from 'swiper';
// import { BehaviorSubject } from "rxjs";
// import { StaticService } from "src/services/static.service";
// import { Router } from "@angular/router";


// SwiperCore.use([
//   Navigation,
//   Pagination,
//   Scrollbar,
//   A11y,
//   Virtual,
//   Zoom,
//   Autoplay,
//   Thumbs,
//   Controller
// ]);


// @Component({
//   selector: 'trip-carousel',
//   templateUrl: './trip-carousel.component.html',
//   styleUrls: ['./trip-carousel.component.scss']
// })


// export class TripCarouselComponent implements AfterContentInit {

//   trips:any[]  = [];
//   cardWidth = 352; // Adjust based on your card width and margin
//   currentIndex = 0;
//   visibleCards  // Number of cards visible at a time
//   slideOffset = 0;

//   constructor (public staticService: StaticService, private router: Router) {    
//     this.staticService.getTrips().subscribe(data => {
//       this.trips = data.trips;
//     })
//   }


  
//   ngOnInit() {
//     console.log(111, this.visibleCards)
//   }

//   ngAfterContentInit(): void {
//   }
  
//   next() {
//     this.visibleCards = document.getElementById('slider-main').offsetWidth / (this.cardWidth + 32);
//     console.log(this.visibleCards)
//       if (this.currentIndex + 1 < this.trips.length - this.visibleCards ) {
//         this.currentIndex++;
//         this.slideOffset = -this.currentIndex * this.cardWidth;
//       }
//   }

//   previous() {
//     if (this.currentIndex > 0) {
//       this.currentIndex--;
//       this.slideOffset = -this.currentIndex * this.cardWidth;
//     }
//   }

//   navigateToTrip(trip) {
//     this.router.navigate([`trip/${trip.id}`]);
//   }

// }






import { Component, OnInit } from '@angular/core';
import { StaticService } from "src/services/static.service";
import { Router } from "@angular/router";

@Component({
  selector: 'trip-carousel',
  templateUrl: './trip-carousel.component.html',
  styleUrls: ['./trip-carousel.component.scss']
})
export class TripCarouselComponent implements OnInit {
  // trips = [
  //   { title: 'Trip 1', description: 'Description 1' },
  //   { title: 'Trip 2', description: 'Description 2' },
  //   { title: 'Trip 3', description: 'Description 3' },
  //   { title: 'Trip 4', description: 'Description 4' },
  //   { title: 'Trip 5', description: 'Description 5' },
  //   { title: 'Trip 6', description: 'Description 6' },
  //   { title: 'Trip 7', description: 'Description 7' },
  //   { title: 'Trip 8', description: 'Description 8' },
  //   { title: 'Trip 9', description: 'Description 9' }
  // ];
  trips:any[]  = [];

  pages: any[][] = [];
  currentPage = 0;

    constructor (public staticService: StaticService, private router: Router) {    
    this.staticService.getTrips().subscribe(data => {
      this.trips = data.trips;
    this.groupTrips();

    })
  }

  ngOnInit(): void {
  }

  groupTrips(): void {
    this.pages = [];
    for (let i = 0; i < this.trips.length; i += 4) {
      this.pages.push(this.trips.slice(i, i + 4));
    }
  }

  nextPage(): void {
    if (this.currentPage < this.pages.length - 1) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  goToPage(index: number): void {
    this.currentPage = index;
  }

    navigateToTrip(trip) {
    this.router.navigate([`trip/${trip.id}`]);
  }
}
