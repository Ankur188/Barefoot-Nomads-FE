// import { Component, HostListener } from '@angular/core';

// @Component({
//   selector: 'app-draggable-bottom-sheet',
//   templateUrl: './draggable-bottom-sheet.component.html',
//   styleUrls: ['./draggable-bottom-sheet.component.scss'],
// })
// export class DraggableBottomSheetComponent {
//   startY = 0;
//   currentY = 0;
//   translateY = 0;
//   isDragging = false;
//   collapsedY = 120; // px visible at bottom
//   expandedY = 0;

//   ngOnInit() {
//     this.translateY = this.collapsedY;
//   }

//   onTouchStart(event: TouchEvent) {
//     this.isDragging = true;
//     this.startY = event.touches[0].clientY;
//   }

//   onTouchMove(event: TouchEvent) {
//     if (!this.isDragging) return;
//     this.currentY = event.touches[0].clientY;
//     const deltaY = this.currentY - this.startY;
//     const newTranslateY = this.translateY + deltaY;
//     if (newTranslateY >= this.expandedY && newTranslateY <= this.collapsedY + 50) {
//       this.translateY = newTranslateY;
//       this.startY = this.currentY;
//     }
//   }

//   onTouchEnd() {
//     this.isDragging = false;
//     // Snap to expanded or collapsed based on threshold
//     this.translateY = this.translateY < this.collapsedY / 2 ? this.expandedY : this.collapsedY;
//   }
// }

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from 'src/services/booking.service';

@Component({
  selector: 'app-draggable-bottom-sheet',
  templateUrl: './draggable-bottom-sheet.component.html',
  styleUrls: ['./draggable-bottom-sheet.component.scss'],
})
export class DraggableBottomSheetComponent implements OnInit {
  startY = 0;
  currentY = 0;
  translateY = 0; // will be set in ngOnInit
  expandedY = 0;
  collapsedY = 0; // will be set in ngOnInit
  isDragging = false;
  isExpanded = false; // track expanded/collapsed state
  @Input() isBookingPage = false;
  @Input() details: any;
  @Input() destinations: Array<string>;
  @Input() numberOfTravellers: number;
  @Input() roomPrice: number;
  @Input() roomType: string;
  @Input() tripId: string;
  @Input() totalPrice: number;
  @Input() batchSelected: any;
  @Output() pay: EventEmitter<any> = new EventEmitter();
  couponCode: FormControl = new FormControl('');
  isCouponValid: boolean = false;
  couponError: string = '';
  appliedCoupon: any = null;

  constructor(private router: Router, private bookingService: BookingService) {}

  ngOnInit(): void {
    this.setHeights();
    window.addEventListener("resize", this.setHeights.bind(this));
  }

  setHeights() {
    const vh = window.innerHeight;
    
    if (this.isBookingPage) {
      // For booking page: height 58vh
      const sheetHeight = vh * 0.58;
      // When expanded: no transform (use CSS bottom: 9rem)
      this.expandedY = 0;
      // When collapsed: move down to hide content, leave only handle
      this.collapsedY = sheetHeight - 30; // show only ~30px (handle area)
    } else {
      // For non-booking page: height 52vh
      const sheetHeight = vh * 0.52;
      // When expanded: no transform (use CSS bottom: 10rem)
      this.expandedY = 0;
      // When collapsed: move down to hide content, leave only handle
      this.collapsedY = sheetHeight - 30; // show only ~30px (handle area)
    }
    
    this.translateY = this.collapsedY;
    this.isExpanded = false;
  }
  onTouchStart(event: TouchEvent) {
    this.isDragging = true;
    this.startY = event.touches[0].clientY;
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;
    this.currentY = event.touches[0].clientY;
    const deltaY = this.currentY - this.startY;
    const newY = this.translateY + deltaY;

    if (newY >= this.expandedY && newY <= this.collapsedY) {
      this.translateY = newY;
      this.startY = this.currentY;
    }
  }

  onTouchEnd() {
    this.isDragging = false;
    // Calculate midpoint between expanded and collapsed positions
    const midpoint = (this.expandedY + this.collapsedY) / 2;
    // Snap to expanded if closer to expanded, otherwise snap to collapsed
    this.translateY = this.translateY < midpoint ? this.expandedY : this.collapsedY;
    // Update expanded state
    this.isExpanded = this.translateY === this.expandedY;
  }

  bookNow() {
    this.router.navigate([`trip/${this.tripId}/booking`]);
  }

  payNow() {
    this.pay.emit();
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
