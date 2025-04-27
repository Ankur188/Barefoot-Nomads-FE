import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/services/loading.service';
import { StaticService } from 'src/services/static.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  batchInfo:any = [
    {
      dates:'JAN 12 - 16, 2025',
      status : 'AVAILABLE',
      startingPrice : '10,50,000'
    },
    {
      dates:'JAN 22 - 27, 2025',
      status : 'FULL',
      startingPrice : '7400'
    },{
      dates:'FEB 04 - 08, 2025',
      status : 'FILLING FAST',
      startingPrice : '6400'
    },{
      dates:'MAR 07 - 11, 2025',
      status : 'FILLING FAST',
      startingPrice : '6000'
    }
  ]

  occupancy:any = [
    {
      name:'TRIPLE OCCUPANCY',
      price: ''
    },
    {
      name:'DOUBLE OCCUPANCY',
      price: '300'
    },
    {
      name:'SINGLE OCCUPANCY',
      price: '600'
    }
  ]

  currentPage = 1;
  itemsPerPage = 4;
  paginatedBatches = [];
  totalPages = Math.ceil(this.batchInfo.length / this.itemsPerPage);
  bannerUrl: any;
  tripId = '';
  details: any;
  numberOfTravellers = 1;
  destinations: any;
  roomPrice = 200;
    loading$: Observable<boolean>;
  
  constructor(public staticService: StaticService, private router: Router, private activatedRoute : ActivatedRoute, private loadingService: LoadingService) { 
    this.loading$ = this.loadingService.loading$;
    this.activatedRoute.paramMap.subscribe(params => {
      this.tripId = params.get('id');
      console.log('adadasdsa', this.tripId)
    })
    this.getTripDetails();
    this.updatePagination();
    this.getBanner();
  }
  


  ngOnInit(): void {
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
    }, 1500);
  }

  getTripDetails() {
    this.staticService.getTripDetails(this.tripId).subscribe(data => {
      this.details = data;
      this.destinations = data.desitnations.split(',');
      console.log('details', this.details)
    })
  }

  updateCounter(type) {
    if(type === 'increase') {
      this.numberOfTravellers++;
    }else if(type === 'decrease' && this.numberOfTravellers > 1){
      this.numberOfTravellers--;
    }
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedBatches = this.batchInfo.slice(start, start + this.itemsPerPage);
  }

  setPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  get pages() {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  getBanner() {
    this.staticService.getBanner('home_page_banner').subscribe((data) => {
      this.bannerUrl = data.imageUrl;
    });
  }

  payNow() {
    this.router.navigate(['trip/1-91-87-185-984-48/booking/81-4518451-87185-7714']);
  }

  navigateBack() {
    this.router.navigate(['./'])
  }

  selectRoom(price) {
    this.roomPrice = price;
  }

}
