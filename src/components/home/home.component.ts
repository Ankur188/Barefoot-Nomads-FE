import { Component, HostListener, OnInit } from '@angular/core';
import { StaticService } from 'src/services/static.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  viewPort = window.innerWidth;
  bannerUrl: string = '';
  hasTrips: boolean = false;
  trips: any[] = [];
  
  constructor(public staticService: StaticService) {}

  ngOnInit(): void {
    this.staticService.getBanner('home-page-banner').subscribe({
      next: (data) => {
        this.bannerUrl = data.imageUrl;
      },
      error: (error) => {
        console.error('Failed to load banner:', error);
        this.bannerUrl = '';
      }
    });
    
    // Fetch trips and filter based on lowestPriceBatch
    this.staticService.getTrips().subscribe(data => {
      const currentTimestamp = Date.now();
      this.trips = (data.trips || []).filter((trip: any) => {
        // Show trip only if it has a lowestPriceBatch with upcoming from_date
        if (trip.lowestPriceBatch && trip.lowestPriceBatch.from_date) {
          return (trip.lowestPriceBatch.from_date * 1000) > currentTimestamp;
        }
        return false;
      });
      
      this.hasTrips = this.trips.length > 0;
    });
  }
}
