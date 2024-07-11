import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss']
})
export class ImageSliderComponent implements OnInit {

  copy;
  images: string[] = [
    '../../assets/artboard-2.jpeg',
    '../../assets/artboard-3.jpeg',
    '../../assets/artboard-4.jpeg',
    '../../assets/artboard-2.jpeg',
    '../../assets/artboard-3.jpeg',
    '../../assets/artboard-4.jpeg',
    '../../assets/artboard-2.jpeg',
    '../../assets/artboard-3.jpeg',
    '../../assets/artboard-4.jpeg',
    '../../assets/artboard-2.jpeg'
    // Add more images as needed
  ];
  constructor() { }

  ngOnInit(): void {

  }

}
