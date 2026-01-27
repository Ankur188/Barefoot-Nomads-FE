import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BookingService } from 'src/services/booking.service';
import { LoadingService } from 'src/services/loading.service';
import { StaticService } from 'src/services/static.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  batches: any[] = [];

  occupancy: any = {
    200: 'TRIPLE OCCUPANCY',
    400: 'DOUBLE OCCUPANCY',
    600: 'SINGLE OCCUPANCY',
  };

  viewPort = window.innerWidth;
  currentPage = 1;
  itemsPerPage = 4;
  paginatedBatches = [];
  totalPages = 0;
  bannerUrl: any;
  tripId = '';
  details: any;
  numberOfTravellers = 1;
  destinations: any;
  roomPrice = 200;
  loading$: Observable<boolean>;
  bookingForm: FormGroup = new FormGroup({
    fullName: new FormControl(''),
    number: new FormControl(''),
    guardianNumber: new FormControl(''),
    email: new FormControl(''),
  });
  batchSelected: any;
  totalPrice = 0;
  batchFilter = 'All';
  monthObj = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
  };
  currentMonth = new Date().getMonth() + 1;
  monthObjKeys =
    this.currentMonth <= 10
      ? [this.currentMonth, this.currentMonth + 1, this.currentMonth + 2]
      : this.currentMonth === 11
      ? [this.currentMonth, this.currentMonth + 1, 1]
      : this.currentMonth === 12
      ? [this.currentMonth, 1, 2]
      : [];

  constructor(
    public staticService: StaticService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private bookingService: BookingService
  ) {
    this.loading$ = this.loadingService.loading$;
    this.activatedRoute.paramMap.subscribe((params) => {
      this.tripId = params.get('id');
      console.log('adadasdsa', this.tripId);
    });
    this.getTripDetails();
    this.getBanner();
  }

  ngOnInit(): void {}

  getTripDetails() {
    this.staticService.getTripDetails(this.tripId).subscribe((data) => {
      this.getBatches(this.tripId);
      this.details = data;
      this.destinations = data.desitnations.split(',');
      console.log('details', this.details);
    });
  }

  getBatches(id: string, page: number = 1, filter?) {
    this.staticService
      .getBatches(id, page, filter)
      .subscribe((data) => {
        this.batches = data.data;
        this.batchSelected = this.batches[0];
        this.totalPrice = this.batches[0].price - 200 + this.roomPrice;
        this.totalPages = data.totalPages;
        this.updatePagination();
      });
  }

  getBanner() {
    this.staticService.getBanner('home_page_banner.png').subscribe((data) => {
      this.bannerUrl = data.imageUrl;
    });
  }

  payNow() {
    let payload = this.bookingForm.getRawValue();
    payload['userId'] = localStorage.getItem('id');
    payload['batch_id'] = this.batchSelected.id;
    payload['payment'] =
      this.totalPrice * this.numberOfTravellers +
      0.05 * (this.totalPrice * this.numberOfTravellers);
    payload['travellers'] = this.numberOfTravellers;
    payload['roomType'] = this.occupancy[this.roomPrice];
    this.bookingService.bookTrip(payload).subscribe((data) => {
      if (data) {
        this.router.navigate([
          `trip/${data.booking[0].trip_id}/booking/${data.booking[0].id}`,
        ]);
      }
    });
  }

  navigateBack() {
    this.router.navigate(['../']);
  }

  selectRoom(price) {
    event.stopPropagation();
    this.totalPrice -= this.roomPrice;
    this.totalPrice += price;
    this.roomPrice = price;
    console.log('rrom', this.occupancy[this.roomPrice]);
  }

  selectBatch(batch) {
    this.totalPrice -= this.batchSelected.price;
    this.totalPrice += batch.price;
    this.batchSelected = batch;
  }

  updateCounter(type) {
    if (type === 'increase') {
      this.numberOfTravellers++;
    } else if (type === 'decrease' && this.numberOfTravellers > 1) {
      this.numberOfTravellers--;
    }
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
    this.getBatches(this.tripId, this.currentPage);
    this.updatePagination();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getBatches(this.tripId, this.currentPage);
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getBatches(this.tripId, this.currentPage);
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

  selectFilter(filter) {
    if (filter === 'All') {
      this.getBatches(this.tripId, 1);
    } else {
      this.getBatches(this.tripId, 1, filter - 1);
    }
    this.batchFilter = filter;
  }
}
