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


  currentPage = 1;
  itemsPerPage = 8;
  paginatedBatches = [];
  totalPages = Math.ceil(this.tripsDetails.length / this.itemsPerPage);
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
    this.updatePagination()
  }

  getBanner() {
    this.staticService.getBanner('home_page_banner').subscribe((data) => {
      this.bannerUrl = data.imageUrl;
    });
  }

 

  get pages() {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedBatches = this.tripsDetails.slice(start, start + this.itemsPerPage);
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
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.animationDirection = 'right';
      this.currentPage++;
      this.updatePagination();
    }
  }


  // filter logic 


  toggleFilter(event: MouseEvent) {
    event.stopPropagation(); // Optional: prevents bubbling
    console.log('filter clicked')
    this.filterVisible = !this.filterVisible;
    if (this.tripSection?.nativeElement) {
      this.tripSection.nativeElement.classList.toggle('filter-open', this.filterVisible);
    }
  }



  @HostListener('document:click', ['$event'])
handleClickOutside(event: MouseEvent) {
   if (this.skipCloseFilter) return; // skip if triggered by removeFilter
  const clickedInsideFilter = this.filterContainer?.nativeElement.contains(event.target);
  const clickedInsideApplied = this.appliedFilterSection?.nativeElement.contains(event.target);

  // Only close if clicked outside both filter dropdown AND applied filters
  if (this.filterVisible && !clickedInsideFilter && !clickedInsideApplied) {
    this.filterVisible = false;
    this.tripSection?.nativeElement.classList.remove('filter-open');
  }
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
