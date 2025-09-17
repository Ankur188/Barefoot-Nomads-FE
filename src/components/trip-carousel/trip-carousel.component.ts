import { Component, OnInit } from '@angular/core';
import { StaticService } from "src/services/static.service";
import { Router } from "@angular/router";

@Component({
  selector: 'trip-carousel',
  templateUrl: './trip-carousel.component.html',
  styleUrls: ['./trip-carousel.component.scss']
})
export class TripCarouselComponent implements OnInit {
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

  navigateToAdventures() {
    this.router.navigate(['adventures']);
  }
}
