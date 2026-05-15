import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { StaticService } from 'src/services/static.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adventures',
  templateUrl: './adventures.component.html',
  styleUrls: ['./adventures.component.scss'],
  animations: [
    trigger('slideAnimation', [
      transition(
        ':enter',
        [
          style({ transform: 'translateX({{enterFrom}})', opacity: 0 }),
          animate(
            '400ms ease',
            style({ transform: 'translateX(0)', opacity: 1 })
          ),
        ],
        { params: { enterFrom: '100%' } }
      ),

      transition(
        ':leave',
        [
          animate(
            '400ms ease',
            style({ transform: 'translateX({{leaveTo}})', opacity: 0 })
          ),
        ],
        { params: { leaveTo: '-100%' } }
      ),
    ]),
  ],
})
export class AdventuresComponent implements OnInit, AfterViewInit {
  bannerUrl: any;
  tripsDetails: any = [
    {
      tripName: 'Kedarnath',
      duration: 'JAN-MARCH',
      price: 2400,
      stay: '8 Days 7 Nights',
      recentlyAdded: true,
      img: 'assets/adventureImages/kedarnathTrip.svg',
    },
    {
      tripName: 'Tawang',
      duration: 'JAN-MARCH',
      price: 7400,
      stay: '8 Days 7 Nights',
      recentlyAdded: false,
      img: 'assets/adventureImages/tawangTrip.svg',
    },
    {
      tripName: 'Singapore',
      duration: 'APR-JUN',
      price: 7400,
      stay: '8 Days 7 Nights',
      recentlyAdded: false,
      img: 'assets/adventureImages/singaporeTrip.svg',
    },
    {
      tripName: 'Kashmir',
      duration: 'JUL-SEP',
      price: 7400,
      stay: '8 Days 7 Nights',
      recentlyAdded: false,
      img: 'assets/adventureImages/kashmirTrip.svg',
    },
    {
      tripName: 'Spiti',
      duration: 'OCT-DEC',
      price: 7400,
      stay: '8 Days 7 Nights',
      recentlyAdded: false,
      img: 'assets/adventureImages/spitiTrip.svg',
    },
    {
      tripName: 'Meghalaya',
      duration: 'APR-JUN',
      price: 3500,
      stay: '8 Days 7 Nights',
      recentlyAdded: true,
      img: 'assets/adventureImages/meghalayaTrip.svg',
    },
    {
      tripName: 'Bali',
      duration: 'JAN-MARCH',
      price: 2400,
      stay: '8 Days 7 Nights',
      recentlyAdded: false,
      img: 'assets/adventureImages/baliTrip.svg',
    },
    {
      tripName: 'Vietnam',
      duration: 'APR-JUN',
      price: 7400,
      stay: '8 Days 7 Nights',
      recentlyAdded: true,
      img: 'assets/adventureImages/vietnamTrip.svg',
    },
    {
      tripName: 'Bali',
      duration: 'JAN-MARCH',
      price: 2400,
      stay: '8 Days 7 Nights',
      recentlyAdded: false,
      img: 'assets/adventureImages/baliTrip.svg',
    },
    {
      tripName: 'MAuritius',
      duration: 'APR-JUN',
      price: 89000,
      stay: '8 Days 7 Nights',
      recentlyAdded: true,
      img: 'assets/adventureImages/vietnamTrip.svg',
    },
  ];

  filterDetails: any = [
    {
      filterCriteria: 'Select Adventures',
      filterData: [
        'KedarNath',
        'Tawang',
        'Singapore',
        'Kashmir',
        'Spiti',
        'Bali',
        'Meghalaya',
      ],
    },
    {
      filterCriteria: 'Select Locations',
      filterData: [
        'KedarNath',
        'Tawang',
        'Singapore',
        'Kashmir',
        'Spiti',
        'Bali',
        'Meghalaya',
      ],
    },
    {
      filterCriteria: 'Select Duration',
      filterData: [
        'JAN-MAR',
        'APR-JUN',
        'JUL-SEP',
        'OCT-DEC',
        'DEC-FEB',
        'APR-JUN',
      ],
    },
    {
      filterCriteria: 'Select Approx. Budget',
      filterData: [2400, 7400, 7400, 7400, 7400, 7400, 3500, 2400],
    },
  ];
  filterItems: any = [];
  selectedValues: any[] = [];
  trips: any[] = [];
  searchPreference: any = ['Recommended', 'Most Visited'];
  allTrips: any[] = [];

  currentPage = 1;
  itemsPerPage = 8;
  paginatedBatches: any[][] = [];
  totalPages = Math.ceil(this.tripsDetails.length / this.itemsPerPage);
  filterVisible: boolean = false;
  appliedFilterSectionVisible: boolean = false;
  appliedFiltersArray: { criteria: string; value: string | number }[] = [];
  private skipCloseFilter = false; // flag to prevent closing
  // for animation
  animationDirection: 'left' | 'right' = 'right';

  @ViewChild('filterContainer') filterContainer: ElementRef;
  @ViewChild('tripSection') tripSection: ElementRef;
  @ViewChild('appliedFilterSection') appliedFilterSection: ElementRef;
  @ViewChild('cardCarousel') cardCarousel: ElementRef;

  constructor(public staticService: StaticService) {}

  ngOnInit(): void {
    this.selectedValues = this.filterDetails.map(() => undefined);
    //this.totalPages = Math.ceil(this.tripsDetails.length / this.itemsPerPage);
    this.staticService.getTrips().subscribe((data) => {
      this.trips = data.trips;
      this.allTrips = data.trips; // store original data
      this.updatePagination();
      console.log('All Trips', this.allTrips);
      console.log('Filtered Trips', this.trips);
      console.log('Trips before filter:', this.allTrips.length);
      console.log('Trips after filter:', this.trips.length);
    });
    this.updatePagination();
  }

  ngAfterViewInit(): void {
    // align applied filter pills after view initializes
    setTimeout(() => this.alignAppliedFilters(), 50);
  }

  getBanner() {
    this.staticService.getBanner('home_page_banner').subscribe((data) => {
      this.bannerUrl = data.imageUrl;
    });
  }

  get pages() {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  //   updatePagination() {
  //   const start = (this.currentPage - 1) * this.itemsPerPage;
  //   this.paginatedBatches = this.tripsDetails.slice(start, start + this.itemsPerPage);
  // }

  // updatePagination() {
  //   const start = (this.currentPage - 1) * this.itemsPerPage;
  //   this.paginatedBatches = this.trips.slice(start, start + this.itemsPerPage);
  // }


  updatePagination() {
  this.totalPages = Math.ceil(this.trips.length / this.itemsPerPage) || 1;

  // Prevent going to invalid page
  if (this.currentPage > this.totalPages) {
    this.currentPage = this.totalPages;
  }

  const start = (this.currentPage - 1) * this.itemsPerPage;
  this.paginatedBatches = this.trips.slice(start, start + this.itemsPerPage);
}

  setPage(page: number) {
    if (page !== this.currentPage) {
      this.animationDirection = page > this.currentPage ? 'right' : 'left';
      this.currentPage = page;
      this.updatePagination();
    }
  }

  // pagnation Logic //

  prevPage() {
    if (this.currentPage > 1) {
      this.animationDirection = 'left';
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.animationDirection = 'right';
      this.currentPage++;
    }
  }

  // filter logic

  toggleFilter(event: MouseEvent) {
    event.stopPropagation(); // Optional: prevents bubbling
    console.log('filter clicked');
    this.filterVisible = !this.filterVisible;
    if (this.tripSection?.nativeElement) {
      this.tripSection.nativeElement.classList.toggle(
        'filter-open',
        this.filterVisible
      );
    }
    // reposition applied filter pills when filter toggles
    setTimeout(() => this.alignAppliedFilters(), 80);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (this.skipCloseFilter) return; // skip if triggered by removeFilter
    const clickedInsideFilter = this.filterContainer?.nativeElement.contains(
      event.target
    );
    const clickedInsideApplied =
      this.appliedFilterSection?.nativeElement.contains(event.target);

    // Only close if clicked outside both filter dropdown AND applied filters
    if (this.filterVisible && !clickedInsideFilter && !clickedInsideApplied) {
      this.filterVisible = false;
      this.tripSection?.nativeElement.classList.remove('filter-open');
    }
  }

  // clearAll(event) {
  //   event.stopPropagation();
  //   this.appliedFilterSectionVisible = false;
  //   this.selectedValues = [];
  // }

  clearAll(event) {
    event.stopPropagation();
    this.appliedFilterSectionVisible = false;
    this.selectedValues = [];
    this.appliedFiltersArray = [];
    this.trips = [...this.allTrips];
     this.currentPage = 1; // important
  this.updatePagination();
  }

  

  // onApplyFilter() {
  //   this.appliedFilterSectionVisible = true;

  //   const newFilterArray = this.selectedValues
  //     .map((value, index) => {
  //       if (value !== undefined) {
  //         return {
  //           criteria: this.filterDetails[index].filterCriteria,
  //           value: value,
  //         };
  //       }
  //       return null;
  //     })
  //     .filter((item) => item !== null) as any[];

  //   this.appliedFiltersArray = newFilterArray;
  //   console.log('Filters', this.appliedFiltersArray);

  //   this.applyFilters(); // 🔴 THIS MUST BE HERE
  // }

  onApplyFilter() {
  this.appliedFilterSectionVisible = true;

  const newFilterArray = this.selectedValues
    .map((value, index) => {
      if (value !== undefined) {
        return {
          criteria: this.filterDetails[index].filterCriteria,
          value: value,
        };
      }
      return null;
    })
    .filter((item) => item !== null) as any[];

  this.appliedFiltersArray = newFilterArray;

  this.currentPage = 1; // 🔴 reset page after filter
  this.applyFilters();
}

  applyFilters() {
    if (this.appliedFiltersArray.length === 0) {
      this.trips = [...this.allTrips];
      this.updatePagination();
      return;
    }

    this.trips = this.allTrips.filter((trip) => {
      return this.appliedFiltersArray.every((filter) => {
        const value = String(filter.value).toLowerCase().trim();

        switch (filter.criteria) {
          case 'Select Adventures':
            return trip.destination_name?.toLowerCase().includes(value);

          case 'Select Locations':
            return trip.desitnations?.toLowerCase().includes(value);

case "Select Duration":

  if (!trip.from_month || !trip.to_month) return false;

  const fromMonth = new Date(trip.from_month * 1000).getMonth();
  const toMonth = new Date(trip.to_month * 1000).getMonth();

  if (value === "jan-march") {
    return fromMonth >= 0 && toMonth <= 2;
  }

  if (value === "apr-jun") {
    return fromMonth >= 3 && toMonth <= 5;
  }

  if (value === "jul-sep") {
    return fromMonth >= 6 && toMonth <= 8;
  }

  if (value === "oct-dec") {
    return fromMonth >= 9 && toMonth <= 11;
  }

  return true;

          case 'Select Approx. Budget':
            return trip.lowestPriceBatch?.price <= Number(filter.value);

          default:
            return true;
        }
      });
    });

    this.updatePagination();
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.alignAppliedFilters();
  }

  private alignAppliedFilters() {
    try {
      const filterEl = this.filterContainer?.nativeElement as HTMLElement;
      const appliedEl = this.appliedFilterSection?.nativeElement as HTMLElement;
      const carouselEl = this.cardCarousel?.nativeElement as HTMLElement;
      if (!filterEl || !appliedEl || !carouselEl) return;

      const filterRect = filterEl.getBoundingClientRect();
      const carouselRect = carouselEl.getBoundingClientRect();

      // compute left offset so the applied pills start at the right edge of filter container
      const left = filterRect.right - carouselRect.left + 8; // small gap
      appliedEl.style.position = 'absolute';
      appliedEl.style.left = `${Math.max(0, left)}px`;
      appliedEl.style.top = '0px';
    } catch (e) {
      // ignore
    }
  }

  removeFilter(index, event: MouseEvent) {
    event?.stopPropagation();
    // this.skipCloseFilter = true
    // console.log(this.appliedFiltersArray ,'appliedFilter')
    //  this.appliedFiltersArray.splice(index ,1 )
    // if(this.appliedFiltersArray.length === 0 && this.tripSection?.nativeElement ){
    //   this.tripSection.nativeElement.classList.add('filter-open');
    // }
    this.appliedFiltersArray.splice(index, 1);
    this.applyFilters();

    // Reset flag after short delay to allow HostListener to finish
    setTimeout(() => (this.skipCloseFilter = false), 0);
  }

  getTransform() {
    const cardsPerRow = 4;
    const rowsPerPage = 2;
    const cardsPerPage = cardsPerRow * rowsPerPage; // 8 cards per page

    const cardElement = this.tripSection?.nativeElement.querySelector('.card');
    if (!cardElement) return 'translateX(0)';

    const style = window.getComputedStyle(cardElement);
    const cardWidth = cardElement.offsetWidth;
    const gap = parseInt(style.marginRight) || 0;

    const pageWidth = (cardWidth + gap) * cardsPerRow; // width of 1 row
    const shift = (this.currentPage - 1) * pageWidth; // multiply by current page index

    return `translateX(-${shift}px)`;
  }
}
