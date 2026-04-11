import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  constructor(
    public staticService: StaticService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.loading$ = this.loadingService.loading$;
    this.activatedRoute.paramMap.subscribe((params) => {
      this.tripId = params.get('id');
    });
  }
  tripId: string;
  bannerUrl: string = '';
  trips: any;
  details: any;
  tripImages: string[] = []; // Store trip images from S3 (3 random for display)
  allTripImages: string[] = []; // Store all trip images for lightbox
  showMask = false;
  previewImage = false;
  inclusionSelected = true;
  viewPort = window.innerWidth;
  
  // Computed property for gallery data - transforms allTripImages into lightbox format
  get galleryData() {
    return this.allTripImages.map((imageUrl, index) => ({
      imageSrc: imageUrl,
      imageAlt: `${this.details?.destination_name || 'Trip'} - Image ${index + 1}`
    }));
  }
  
  batches: any[] = [];
  totalPages = 0;
  currentPage = 1;
  itemsPerPage = 4;
  paginatedBatches = [];

  ngOnInit(): void {
    this.getTripDetials();
    this.getBanner();
    // this.getTrips();
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
    }, 3500);
  }

  getTripDetials() {
    this.staticService.getTripDetails(this.tripId).subscribe((data: any) => {
      this.getBatches(data.id);
      this.details = data;
      this.tripImages = data.images || []; // Store the 3 random images for display
      this.allTripImages = data.allImages || []; // Store all images for lightbox
      this.itinerary = JSON.parse(data.itinerary);
      this.keys = Object.keys(this.itinerary);
      this.destinations = data.destinations.split(',');
    });
  }

  getBatches(id: string, page: number = 1, filter?) {
    this.staticService
      .getBatches(id, page, filter)
      .subscribe((data) => {
        // Backend now returns only upcoming batches with available spots
        this.batches = data.data;
        
        this.totalPages = data.totalPages;
        this.updatePagination();
      });
  }

  getBanner() {
    this.staticService.getBanner('home_page_banner.png').subscribe({
      next: (data) => {
        this.bannerUrl = data.imageUrl;
      },
      error: (error) => {
        console.error('Failed to load banner:', error);
        this.bannerUrl = '';
      }
    });
  }

  getTrips() {
    this.staticService.getTrips().subscribe((data) => {
      let shuffled = data.trips.sort(() => 0.5 - Math.random()); // Shuffle the array
      this.trips = shuffled.slice(0, 4);
    });
  }

  scrollToContent(content) {
    this.selectedTab = content;
    const headerOffset = 8 * 16; // 10rem converted to pixels (assuming 1rem = 16px)
    const element = document.getElementById(content);

    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  bookNow() {
    // Only navigate if there are available batches
    if (this.batches && this.batches.length > 0) {
      this.router.navigate([`trip/${this.tripId}/booking`]);
    }
  }

  openLightbox() {
    console.log(222222, this.previewImage);
    this.showMask = true;
    this.previewImage = true;
  }

  closeLightBox(event) {
    this.showMask = false;
    this.previewImage = false;
  }

  //pagination methods
  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedBatches = this.batches.slice(
      start,
      start + this.itemsPerPage
    );
  }

  setPage(page: number) {
    this.currentPage = page;
    this.getBatches(this.details.id, this.currentPage);
    this.updatePagination();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getBatches(this.details.id, this.currentPage);
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getBatches(this.details.id, this.currentPage);
      this.updatePagination();
    }
  }

  get pages() {
    console.log(
      'total pages',
      Math.ceil(this.batches.length / this.itemsPerPage),
      this.totalPages
    );
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }
}
