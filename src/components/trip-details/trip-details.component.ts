import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/services/loading.service';
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
  selectedTab: any = 'overview';
  loading$: Observable<boolean>;
  constructor(public staticService: StaticService, private activatedRoute: ActivatedRoute, private router: Router, private loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
    this.activatedRoute.paramMap.subscribe(params => {
      this.tripId = params.get('id');
    })
  }
  tripId:string;
  bannerUrl: string = '';
  trips: any;
  details: any;
  showMask = false;
  previewImage = false;
  inclusionSelected = true;
  galleryData = [
    {
      imageSrc: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
      imageAlt: '1'
    },
    {
      imageSrc: 'https://images.unsplash.com/photo-1642670310920-6f4e3a3adee3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80',
      imageAlt: '2'
    },
    {
      imageSrc: 'https://images.unsplash.com/photo-1642570517818-99c0fd6f0349?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      imageAlt: '3'
    },
    {
      imageSrc: 'https://images.unsplash.com/photo-1642649149963-0ef6779df6c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
      imageAlt: '4'
    },
    {
      imageSrc: 'https://images.unsplash.com/photo-1642618215095-3523a9a36893?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
      imageAlt: '5'
    },
    {
      imageSrc: 'https://images.unsplash.com/photo-1642628658566-1db49cadf78c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=465&q=80',
      imageAlt: '6'
    },
    {
      imageSrc: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
      imageAlt: '7'
    },
    {
      imageSrc: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=975&q=80',
      imageAlt: '8'
    },
    {
      imageSrc: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80',
      imageAlt: '9'
    },
    {
      imageSrc: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
      imageAlt: '10'
    },
    {
      imageSrc: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
      imageAlt: '11'
    },
    {
      imageSrc: 'https://images.unsplash.com/photo-1465189684280-6a8fa9b19a7a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
      imageAlt: '12'
    },
    {
      imageSrc: 'https://images.unsplash.com/photo-1506260408121-e353d10b87c7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80',
      imageAlt: '13'
    }
  ]

  ngOnInit(): void {
    this.getTripDetials();
    this.getBanner();
    this.getTrips();
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
    }, 3500);
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
    this.staticService.getTrips().subscribe(data => {
      let shuffled = data.trips.sort(() => 0.5 - Math.random()); // Shuffle the array 
      this.trips =  shuffled.slice(0, 4);
    })
  }

  scrollToContent(content) {
    this.selectedTab = content;
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

  bookNow() {
    this.router.navigate([`trip/${this.tripId}/booking`]);
  }


  openLightbox() {
    console.log(222222, this.previewImage)
    this.showMask = true;
    this.previewImage = true;
  }

  closeLightBox(event) {
    this.showMask = false;
    this.previewImage = false;
  }
}
