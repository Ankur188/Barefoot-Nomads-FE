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
  translateY = 140; // sheet hidden by default except preview
  // translateY = 60; // sheet hidden by default except preview
  expandedY = 0;
  // collapsedY = 280; // same as initial translateY
  collapsedY = 140; // same as initial translateY
  isDragging = false;
  @Input() isBookingPage = false;
  @Input() details: any;
  @Input() destinations: Array<string>;
  @Input() numberOfTravellers: number;
  @Input() roomPrice: number;
  @Input() tripId: string;
  @Input() totalPrice: number;
  @Output() pay: EventEmitter<any> = new EventEmitter();
  couponCode: FormControl = new FormControl('');
  isCouponValid: boolean = false;
  couponError: string = '';
  appliedCoupon: any = null;

  constructor(private router: Router, private bookingService: BookingService) {}

  ngOnInit(): void {
    // if (this.isBookingPage) {
    //   this.collapsedY = 280;
    //   this.translateY = 280;
    // }

      const vh = window.innerHeight;

  // collapsed offset (around 15–25% of screen height)
  this.collapsedY = vh * 0.2;   // 20% of device height
  this.translateY = this.collapsedY;

  this.expandedY = 0; // fully expanded

    this.setHeights();
  window.addEventListener("resize", this.setHeights.bind(this));
  }

 setHeights() {
  const vh = window.innerHeight;
  this.collapsedY = vh * 0.2; // 20% screen height collapsed
  if (this.translateY > this.collapsedY) {
    this.translateY = this.collapsedY;
  }
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
    this.translateY =
      this.translateY < this.collapsedY / 2 ? this.expandedY : this.collapsedY;
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
    return this.totalPrice * this.numberOfTravellers + (this.roomPrice - 200) * this.numberOfTravellers;
  }

  getDiscountAmount(): number {
    if (this.appliedCoupon) {
      const baseAmount = this.totalPrice * this.numberOfTravellers + (this.roomPrice - 200) * this.numberOfTravellers;
      return baseAmount * (this.appliedCoupon.deduction / 100);
    }
    return 0;
  }

  getGSTAmount(): number {
    const baseAmount = this.totalPrice * this.numberOfTravellers + (this.roomPrice - 200) * this.numberOfTravellers;
    let amountAfterDiscount = baseAmount;
    
    if (this.appliedCoupon) {
      amountAfterDiscount = baseAmount - (baseAmount * this.appliedCoupon.deduction / 100);
    }
    
    return amountAfterDiscount * 0.05;
  }

  getFinalAmount(): number {
    const baseAmount = this.totalPrice * this.numberOfTravellers + (this.roomPrice - 200) * this.numberOfTravellers;
    let amountAfterDiscount = baseAmount;
    
    if (this.appliedCoupon) {
      amountAfterDiscount = baseAmount - (baseAmount * this.appliedCoupon.deduction / 100);
    }
    
    const gst = amountAfterDiscount * 0.05;
    return amountAfterDiscount + gst;
  }
}
