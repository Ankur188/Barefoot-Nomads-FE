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
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.isBookingPage) {
      this.collapsedY = 280;
      this.translateY = 280;
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
}
