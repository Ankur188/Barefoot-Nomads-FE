import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { StaticService } from 'src/services/static.service';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import { MatSelectModule } from '@angular/material/select';
import { Router } from "@angular/router";


@Component({
  selector: 'app-adventures',
  templateUrl: './adventures.component.html',
  styleUrls: ['./adventures.component.scss'],
  animations: [
  trigger('slideAnimation', [
    transition(':enter', [
      style({ opacity: 0, transform: '{{transform}}' }),
      animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
    ], { params: { transform: 'translateX(100%)' } }),
    transition(':leave', [
      animate('400ms ease-in', style({ opacity: 0, transform: '{{transform}}' }))
    ], { params: { transform: 'translateX(-100%)' } })
  ])
]
})
export class AdventuresComponent implements OnInit {

  bannerUrl: any
  tripsDetails: any = [
    {
      tripName: 'Kedarnath',
      duration: 'JAN-MARCH',
      price: 2400,
      stay: '8 Days 7 Nights',
      recentlyAdded: true,
      img: "assets/adventureImages/kedarnathTrip.svg",
    },
    {
      tripName: 'Tawang',
      duration: 'JAN-MARCH',
      price: 7400,
      stay: '8 Days 7 Nights',
      recentlyAdded: false,
      img: "assets/adventureImages/tawangTrip.svg"
    },
    {
      tripName: 'Singapore',
      duration: 'APR-JUN',
      price: 7400,
      stay: '8 Days 7 Nights',
      recentlyAdded: false,
      img: "assets/adventureImages/singaporeTrip.svg"
    },
    {
      tripName: 'Kashmir',
      duration: 'JUL-SEP',
      price: 7400,
      stay: '8 Days 7 Nights',
      recentlyAdded: false,
      img: "assets/adventureImages/kashmirTrip.svg"
    },
    {
      tripName: 'Spiti',
      duration: 'OCT-DEC',
      price: 7400,
      stay: '8 Days 7 Nights',
      recentlyAdded: false,
      img: "assets/adventureImages/spitiTrip.svg"
    }, {
      tripName: 'Meghalaya',
      duration: 'APR-JUN',
      price: 3500,
      stay: '8 Days 7 Nights',
      recentlyAdded: true,
      img: "assets/adventureImages/meghalayaTrip.svg"
    }, {
      tripName: 'Bali',
      duration: 'JAN-MAR',
      price: 2400,
      stay: '8 Days 7 Nights',
      recentlyAdded: false,
      img: "assets/adventureImages/baliTrip.svg"
    },
    {
      tripName: 'Vietnam',
      duration: 'APR-JUN',
      price: 7400,
      stay: '8 Days 7 Nights',
      recentlyAdded: true,
      img: "assets/adventureImages/vietnamTrip.svg"
    },
    {
      tripName: 'Bali',
      duration: 'JAN-MAR',
      price: 2400,
      stay: '8 Days 7 Nights',
      recentlyAdded: false,
      img: "assets/adventureImages/baliTrip.svg"
    },
  ]

  filterDetails: any = [
    {
      filterCriteria: "Select Adventures",
      filterData: ['KedarNath', 'Tawang', 'Singapore', 'Kashmir', 'Spiti', 'Bali', 'Meghalaya']
    },
    {
      filterCriteria: "Select Locations",
      filterData: ['KedarNath', 'Tawang', 'Singapore', 'Kashmir', 'Spiti', 'Bali', 'Meghalaya']
    },
    {
      filterCriteria: "Select Duration",
      filterData: ['JAN-MARCH', 'JAN-MARCH', 'APR-JUN', 'JUL-SEP', 'OCT-DEC', 'DEC-FEB', 'JAN-MARCH', 'APR-JUN']
    },
    {
      filterCriteria: "Select Approx. Budget",
      filterData: [2400, 7400, 7400, 7400, 7400, 7400, 3500, 2400]
    },
  ]
  filterItems: any = []
  // selectedValues:string[]=[]
  selectedValues: any[] = []

  searchPreference: any = ["Recommended", "Most Visited"]

  // Carousel pagination properties
  pages: any[][] = [];
  currentPage = 0;
  filterVisible: boolean = false;
  appliedFilterSectionVisible: boolean = false
  appliedFiltersArray: { criteria: string; value: string | number }[] = [];
  private skipCloseFilter = false; // flag to prevent closing
  // for animation
  animationDirection: 'left' | 'right' = 'right';

  @ViewChild('filterContainer') filterContainer: ElementRef
  @ViewChild('tripSection') tripSection: ElementRef
   @ViewChild('appliedFilterSection') appliedFilterSection: ElementRef

  constructor(public staticService: StaticService) { }

  ngOnInit(): void {
    this.selectedValues = this.filterDetails.map(() => undefined);
    this.groupTripsIntoPages();
  }

  getBanner() {
    this.staticService.getBanner('home_page_banner').subscribe({
      next: (data) => {
        this.bannerUrl = data.imageUrl;
      },
      error: (error) => {
        console.error('Failed to load banner:', error);
        this.bannerUrl = null;
      }
    });
  }

  // Group trips into pages based on filter state
  groupTripsIntoPages(): void {
    this.pages = [];
    // When filter is closed: 2 rows x 4 cols = 8 trips per page
    // When filter is open: 2 rows x 3 cols = 6 trips per page (filter takes 1 column)
    const tripsPerPage = this.filterVisible ? 6 : 8;
    
    for (let i = 0; i < this.tripsDetails.length; i += tripsPerPage) {
      this.pages.push(this.tripsDetails.slice(i, i + tripsPerPage));
    }
    
    // Ensure currentPage stays within valid range
    if (this.currentPage >= this.pages.length && this.pages.length > 0) {
      this.currentPage = this.pages.length - 1;
    }
  }

  get pageNumbers() {
    return Array(this.pages.length).fill(0).map((_, i) => i + 1);
  }

  setPage(page: number) {
    // page comes as 1-based from template, convert to 0-based
    const pageIndex = page - 1;
    if (pageIndex !== this.currentPage && pageIndex >= 0 && pageIndex < this.pages.length) {
      this.animationDirection = pageIndex > this.currentPage ? 'right' : 'left';
      this.currentPage = pageIndex;
    }
  }

  // Pagination Logic

  prevPage() {
    if (this.currentPage > 0) {
      this.animationDirection = 'left';
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.pages.length - 1) {
      this.animationDirection = 'right';
      this.currentPage++;
    }
  }


  // filter logic 


  toggleFilter(event: MouseEvent) {
    event.stopPropagation();
    console.log('filter clicked');
    this.filterVisible = !this.filterVisible;
    // Recalculate pagination based on new filter state
    this.currentPage = 0; // Reset to first page
    this.groupTripsIntoPages();
  }



  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    // Filter only closes when clicking the filter icon, not when clicking outside
    // This method can be used for other click-outside logic if needed
    return;
  }

  clearAll(event) {
    event.stopPropagation();
    this.appliedFilterSectionVisible = false;
    this.selectedValues = [];
  }




  onApplyFilter() {
    this.appliedFilterSectionVisible = true;

    // Filter out undefined values and create a display list
   const newFilterArray = this.selectedValues
      .map((value, index) => {
        if (value !== undefined) {
          return {
            criteria: this.filterDetails[index].filterCriteria,
            value: typeof value === 'object' ? value.name : value
          };
        }
        return null;
      })
      .filter(item => item !== null) as any[];


      newFilterArray.forEach(filter =>{
        const alreadyExists = this.appliedFiltersArray.some(
          f=> f.criteria === filter.criteria && f.value === filter.value
        );

        if(!alreadyExists){
          this.appliedFiltersArray.push(filter)
        }
      })

      this.selectedValues = this.selectedValues.map(()=> undefined)

    console.log("Applied Filters:", this.appliedFiltersArray );
  }


  removeFilter(index, event:MouseEvent){
    event?.stopPropagation()
    this.skipCloseFilter = true
    console.log(this.appliedFiltersArray ,'appliedFilter')
     this.appliedFiltersArray.splice(index ,1 )
    if(this.appliedFiltersArray.length === 0 && this.tripSection?.nativeElement ){   
      this.tripSection.nativeElement.classList.add('filter-open');
    }


    // Reset flag after short delay to allow HostListener to finish
  setTimeout(() => this.skipCloseFilter = false, 0);

  }


//  trips: any[] = [];
//   pages: any[][] = [];
//   currentPage = 0;
//   filterOpen = false; // toggle when filter opens/closes

//   constructor(public staticService: StaticService, private router: Router) {}

//   ngOnInit(): void {
//     this.staticService.getTrips().subscribe((data: any) => {
//       this.trips = data.trips;
//       this.groupTrips();
//     });
//   }

//   toggleFilter(): void {
//     this.filterOpen = !this.filterOpen;
//     this.groupTrips();
//     this.currentPage = 0; // reset page
//   }

//   groupTrips(): void {
//     this.pages = [];

//     if (!this.filterOpen) {
//       // 2 rows x 4 cols = 8 trips per page
//       for (let i = 0; i < this.trips.length; i += 8) {
//         this.pages.push(this.trips.slice(i, i + 8));
//       }
//     } else {
//       // Filter open: 2 rows, 3 columns per row (6 trips per page)
//       const tripsPerPage = 6;
//       for (let i = 0; i < this.trips.length; i += tripsPerPage) {
//         this.pages.push(this.trips.slice(i, i + tripsPerPage));
//       }
//     }
//   }

//   getGridColumn(index: number): string {
//     if (!this.filterOpen) return '';

//     // First row: columns 2,3,4
//     if (index === 0) return '2';
//     if (index === 1) return '3';
//     if (index === 2) return '4';

//     // Second row: columns 2,3,4
//     if (index === 3) return '2';
//     if (index === 4) return '3';
//     if (index === 5) return '4';

//     return '';
//   }

//   getGridRow(index: number): string {
//     if (!this.filterOpen) return '';
//     return index < 3 ? '1' : '2';
//   }

//   nextPage(): void {
//     if (this.currentPage < this.pages.length - 1) this.currentPage++;
//   }

//   prevPage(): void {
//     if (this.currentPage > 0) this.currentPage--;
//   }

//   goToPage(index: number): void {
//     this.currentPage = index;
//   }

//   navigateToTrip(trip: any) {
//     this.router.navigate([`trip/${trip.id}`]);
//   }

//   navigateToAdventures() {
//     this.router.navigate(['adventures']);
//   }

}
