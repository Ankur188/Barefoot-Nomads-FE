import { animate, AnimationEvent, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss'],
  animations: [
    trigger('animation', [
      transition('void => visible', [
        style({transfrom: 'scale(0.5)'}),
        animate('150ms', style({transform: 'scale(1)'}))
      ]),
      transition('visible => void', [
        style({transfrom: 'scale(1)'}),
        animate('150ms', style({transform: 'scale(0.5)'}))
      ])
    ]),
    trigger('animation2', [
      transition(':leave', [
        style({opacity: 1}),
        animate('50ms', style({opacity: .8}))
      ])
    ])
  ]
})

export class LightboxComponent implements OnInit, OnChanges {
  
  @Input() galleryData = [];
  @Input() showCount = false;
  @Input() previewImage = false;
  @Input() showMask = false;
  @Output() closeLightBox: EventEmitter<any> = new EventEmitter();
  currentLightBoxImage;
  currentIndex = 0;
  controls = true;
  totalImageCount = 0;


  ngOnChanges(changes: SimpleChanges): void {
    console.log(111111, this.previewImage)
  }

  ngOnInit(): void {
    this.currentLightBoxImage = this.galleryData[0];
    this.totalImageCount = this.galleryData.length;
  }

  onAnimationEnd(event: AnimationEvent) {
    if(event.toState === 'void')
      this.showMask = false;
  }

  onClose() {
    this.previewImage = false;  
    this.closeLightBox.emit(null);
  }

  next() {
    this.currentIndex = this.currentIndex + 1;
    if(this.currentIndex > this.galleryData.length-1)
      this.currentIndex = 0;
    this.currentLightBoxImage = this.galleryData[this.currentIndex];
  }

  prev() {
    this.currentIndex = this.currentIndex - 1;
    if(this.currentIndex < 0)
      this.currentIndex = this.galleryData.length - 1;
    this.currentLightBoxImage = this.galleryData[this.currentIndex];
  }

}
