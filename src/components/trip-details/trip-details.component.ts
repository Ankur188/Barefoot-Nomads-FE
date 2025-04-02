import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StaticService } from 'src/services/static.service';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.scss'],
})
export class TripDetailsComponent implements OnInit {
  itinerary: any;
  keys: any;
  destinations: any;
  constructor(public staticService: StaticService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe(params => {
      this.tripId = params.get('id');
    })
  }
  tripId:string;
  bannerUrl: string = '';
  trips: any;
  details: any;

  ngOnInit(): void {
    this.getTripDetials();
    this.getBanner();
    this.getTrips();
  }

  getTripDetials() {
    this.staticService.getTripDetails(this.tripId).subscribe((data: any) => {
      this.details = data;
      this.itinerary = JSON.parse(data.itinerary)
      this.keys = Object.keys(this.itinerary)
      this.destinations = data.desitnations.split(',');
    }
    )
  }

  getBanner() {
    this.staticService.getBanner('home_page_banner').subscribe((data) => {
      this.bannerUrl = data.imageUrl;
    });
  }

  getTrips() {
    this.staticService.getTrips();
    this.staticService.trips$.subscribe(data => {
      let shuffled = data.sort(() => 0.5 - Math.random()); // Shuffle the array 
      this.trips =  shuffled.slice(0, 4);
    })
  }

  scrollToContent(content) {
    const headerOffset = 8 * 16; // 10rem converted to pixels (assuming 1rem = 16px)
    const element = document.getElementById(content);
    
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
