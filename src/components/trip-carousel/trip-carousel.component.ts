import { ChangeDetectorRef, Component, NgZone, ViewChild } from "@angular/core";
import { SwiperComponent } from "swiper/angular";
import SwiperCore , {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
} from 'swiper';
import { BehaviorSubject } from "rxjs";


SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller
]);


@Component({
  selector: 'trip-carousel',
  templateUrl: './trip-carousel.component.html',
  styleUrls: ['./trip-carousel.component.scss']
})


export class TripCarouselComponent {
  
  // @ViewChild('swiperRef', { static: false }) swiperRef?: SwiperComponent;

  // show: boolean;
  // thumbs: any;
  // slides$ = new BehaviorSubject<string[]>(['']);
  // constructor(private cd: ChangeDetectorRef, private ngZone: NgZone) {}
  // ngOnInit() {}

  // getSlides() {
  //   this.slides$.next(Array.from({ length: 600 }).map((el, index) => `Slide ${index + 1}`));
  // }

  // thumbsSwiper: any;
  // setThumbsSwiper(swiper) {
  //   this.thumbsSwiper = swiper;
  // }
  // controlledSwiper: any;
  // setControlledSwiper(swiper) {
  //   this.controlledSwiper = swiper;
  // }

  // indexNumber = 1;
  // exampleConfig = { slidesPerView: 3 };
  // slidesPerView: number = 4;
  // pagination: any = false;

  // slides2 = ['slide 1', 'slide 2', 'slide 3'];
  // replaceSlides() {
  //   this.slides2 = ['foo', 'bar'];
  // }

  // togglePagination() {
  //   if (!this.pagination) {
  //     this.pagination = { type: 'fraction' };
  //   } else {
  //     this.pagination = false;
  //   }
  // }

  // navigation = false;
  // toggleNavigation() {
  //   this.navigation = !this.navigation;
  // }

  // scrollbar: any = false;
  // toggleScrollbar() {
  //   if (!this.scrollbar) {
  //     this.scrollbar = { draggable: true };
  //   } else {
  //     this.scrollbar = false;
  //   }
  // }
  // breakpoints = {
  //   640: { slidesPerView: 2, spaceBetween: 20 },
  //   768: { slidesPerView: 4, spaceBetween: 40 },
  //   1024: { slidesPerView: 4, spaceBetween: 50 },
  // };

  // slides = Array.from({ length: 5 }).map((el, index) => `Slide ${index + 1}`);
  // virtualSlides = Array.from({ length: 600 }).map((el, index) => `Slide ${index + 1}`);

  // log(log: string) {
  //   // console.log(string);
  // }

  // breakPointsToggle: boolean;
  // breakpointChange() {
  //   this.breakPointsToggle = !this.breakPointsToggle;
  //   this.breakpoints = {
  //     640: { slidesPerView: 2, spaceBetween: 20 },
  //     768: { slidesPerView: 4, spaceBetween: 40 },
  //     1024: { slidesPerView: this.breakPointsToggle ? 7 : 5, spaceBetween: 50 },
  //   };
  // }

  // slidesEx = ['first', 'second'];

  // onSlideChange(swiper: any) {
  //   if (swiper.isEnd) {
  //     // all swiper events are run outside of ngzone, so use ngzone.run or detectChanges to update the view.
  //     this.ngZone.run(() => {
  //       this.slidesEx = [...this.slidesEx, `added ${this.slidesEx.length - 1}`];
  //     });
  //     console.log(this.slidesEx);
  //   }
  // }

  cards = [
    { imageUrl: '../../assets/trips-img/kedarnath.png', title: 'kedarnath', new: true, category: 'Uttrakhand', from: 1720952123, to: 1721297723, days: 8, nights: 7},
    { imageUrl: '../../assets/trips-img/manali&kasol.png', title: 'manali & kasol', new: false, category: 'himachal', from: 1720952123, to: 1721297723, days: 8, nights: 7 },
    { imageUrl: '../../assets/trips-img/meghalaya.png', title: 'Meghalaya', new: true, category: 'north-east', from: 1720952123, to: 1721297723, days: 8, nights: 7 },
    { imageUrl: '../../assets/trips-img/kedarnath.png', title: 'kedarnath', new: false, category: 'Uttrakhand', from: 1720952123, to: 1721297723, days: 8, nights: 7 },
    { imageUrl: '../../assets/trips-img/manali&kasol.png', title: 'manali & kasol', new: true, category: 'himachal', from: 1720952123, to: 1721297723, days: 8, nights: 7 },
    { imageUrl: '../../assets/trips-img/meghalaya.png', title: 'meghalaya', new: false, category: 'north-east', from: 1720952123, to: 1721297723, days: 8, nights: 7 }
    // Add more cards as needed
  ];

  tripsList = [{name: 'ALL', selected: true},{name: 'kashmir', selected: false},{name: 'himachal', selected: false},{name: 'uttrakhand', selected: false},{name: 'north-east', selected: false},{name: 'tailor-made', selected: false},]

  cardWidth = 352; // Adjust based on your card width and margin
  currentIndex = 0;
  visibleCards  // Number of cards visible at a time
  slideOffset = 0;
  
  ngOnInit() {
    this.visibleCards = document.getElementById('slider-main').offsetWidth / this.cardWidth;
    console.log(111, this.visibleCards)
  }

  next() {
    if (this.currentIndex + 1 < this.cards.length - this.visibleCards ) {
      this.currentIndex++;
      this.slideOffset = -this.currentIndex * this.cardWidth;
    }
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.slideOffset = -this.currentIndex * this.cardWidth;
    }
  }

}
