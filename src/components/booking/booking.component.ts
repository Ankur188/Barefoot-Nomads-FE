import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  roomPrice = 0;
  roomType = 'TRIPLE OCCUPANCY';
  loading$: Observable<boolean>;
  bookingForm: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    number: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    guardianNumber: new FormControl('', [Validators.pattern('^[0-9]{10}$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  couponCode: FormControl = new FormControl('');
  isCouponValid: boolean = false;
  couponError: string = '';
  appliedCoupon: any = null;
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
    this.staticService.getTripDetails(this.tripId).subscribe((data: any) => {
      this.getBatches(this.tripId);
      this.details = data;
      this.destinations = this.details?.destinations?.split(',');
      console.log('details', this.details);
    });
  }

  getBatches(id: string, page: number = 1, filter?) {
    this.staticService
      .getBatches(id, page, filter)
      .subscribe((data) => {
        this.batches = data.data;
        
        // Only update batchSelected if batches are found
        if(this.batches && this.batches.length > 0) {
          this.batchSelected = this.batches[0];
          
          // Initialize room price with first available room type
          if (this.batchSelected.triple_room > 0) {
            this.roomPrice = this.batchSelected.triple_room;
            this.roomType = 'TRIPLE OCCUPANCY';
          } else if (this.batchSelected.double_room > 0) {
            this.roomPrice = this.batchSelected.double_room;
            this.roomType = 'Double';
          } else if (this.batchSelected.single_room > 0) {
            this.roomPrice = this.batchSelected.single_room;
            this.roomType = 'Single';
          } else {
            this.roomPrice = 0;
            this.roomType = 'Triple';
          }
          
          this.totalPrice = this.batchSelected.price;
        }
        // If no batches found, keep the previously selected batch
        
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
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }
    
    let payload = this.bookingForm.getRawValue();
    payload['userId'] = localStorage.getItem('id');
    payload['batch_id'] = this.batchSelected.id;
    payload['payment'] =
      this.totalPrice * this.numberOfTravellers +
      0.05 * (this.totalPrice * this.numberOfTravellers);
    payload['travellers'] = this.numberOfTravellers;
    payload['roomType'] = this.roomType;
    this.bookingService.bookTrip(payload).subscribe((data) => {
      if (data) {
        this.router.navigate([
          `trip/${data.booking[0].trip_id}/booking/${data.booking[0].id}`,
        ]);
      }
    });
  }

  isFormValid(): boolean {
    return this.bookingForm.valid;
  }

  navigateBack() {
    this.router.navigate(['../']);
  }

  selectRoom(roomTypeKey: string) {
    event.stopPropagation();
    const oldRoomPrice = this.roomPrice;
    
    switch(roomTypeKey) {
      case 'triple':
        this.roomPrice = this.batchSelected?.triple_room || 0;
        this.roomType = 'Triple';
        break;
      case 'double':
        this.roomPrice = this.batchSelected?.double_room || 0;
        this.roomType = 'Double';
        break;
      case 'single':
        this.roomPrice = this.batchSelected?.single_room || 0;
        this.roomType = 'Single';
        break;
    }
  }

  selectBatch(batch) {
    const oldRoomPrice = this.roomPrice;
    this.totalPrice -= this.batchSelected.price;
    this.totalPrice += batch.price;
    this.batchSelected = batch;
    
    // Reset room selection to triple occupancy (default) if available, otherwise first available room
    if (batch.triple_room > 0) {
      this.roomPrice = batch.triple_room;
      this.roomType = 'Triple';
    } else if (batch.double_room > 0) {
      this.roomPrice = batch.double_room;
      this.roomType = 'Double';
    } else if (batch.single_room > 0) {
      this.roomPrice = batch.single_room;
      this.roomType = 'Single';
    } else {
      this.roomPrice = 0;
      this.roomType = 'Triple';
    }
  }

  isRoomAvailable(roomType: string): boolean {
    if (!this.batchSelected) return false;
    
    switch(roomType) {
      case 'triple':
        return (this.batchSelected.triple_room || 0) > 0;
      case 'double':
        return (this.batchSelected.double_room || 0) > 0;
      case 'single':
        return (this.batchSelected.single_room || 0) > 0;
      default:
        return false;
    }
  }

  getRoomPrice(roomType: string): number {
    if (!this.batchSelected) return 0;
    
    switch(roomType) {
      case 'triple':
        return this.batchSelected.triple_room || 0;
      case 'double':
        return this.batchSelected.double_room || 0;
      case 'single':
        return this.batchSelected.single_room || 0;
      default:
        return 0;
    }
  }

  isRoomSelected(roomType: string): boolean {
    switch(roomType) {
      case 'triple':
        return this.roomType === 'Triple';
      case 'double':
        return this.roomType === 'Double';
      case 'single':
        return this.roomType === 'Single';
      default:
        return false;
    }
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

  applyCoupon() {
    const code = this.couponCode.value?.trim();
    if (code) {
      this.couponError = '';
      this.bookingService.validateCoupon(code).subscribe(
        (response) => {
          if (response.success) {
            this.isCouponValid = true;
            this.appliedCoupon = response.coupon;
            this.couponCode.disable();
          }
        },
        (error) => {
          this.isCouponValid = false;
          this.couponError = error.error?.error || 'Coupon code invalid';
        }
      );
    }
  }

  removeCoupon() {
    this.isCouponValid = false;
    this.appliedCoupon = null;
    this.couponError = '';
    this.couponCode.enable();
    this.couponCode.setValue('');
  }

  getBaseAmount(): number {
    return this.totalPrice * this.numberOfTravellers + this.roomPrice * this.numberOfTravellers;
  }

  getTaxRate(): number {
    return this.batchSelected?.tax ? this.batchSelected.tax / 100 : 0.05;
  }

  getDiscountAmount(): number {
    if (this.appliedCoupon) {
      const baseAmount = this.totalPrice * this.numberOfTravellers + this.roomPrice * this.numberOfTravellers;
      return baseAmount * (this.appliedCoupon.deduction / 100);
    }
    return 0;
  }

  getGSTAmount(): number {
    const baseAmount = this.totalPrice * this.numberOfTravellers + this.roomPrice * this.numberOfTravellers;
    let amountAfterDiscount = baseAmount;
    
    if (this.appliedCoupon) {
      amountAfterDiscount = baseAmount - (baseAmount * this.appliedCoupon.deduction / 100);
    }
    
    return amountAfterDiscount * this.getTaxRate();
  }

  getFinalAmount(): number {
    const baseAmount = this.totalPrice * this.numberOfTravellers + this.roomPrice * this.numberOfTravellers;
    let amountAfterDiscount = baseAmount;
    
    if (this.appliedCoupon) {
      amountAfterDiscount = baseAmount - (baseAmount * this.appliedCoupon.deduction / 100);
    }
    
    const gst = amountAfterDiscount * this.getTaxRate();
    return amountAfterDiscount + gst;
  }
}
