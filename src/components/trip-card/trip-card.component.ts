import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'trip-card',
  templateUrl: './trip-card.component.html',
  styleUrls: ['./trip-card.component.scss']
})
export class TripCardComponent implements OnInit {

  @Input() card: any;
  imageURl: string;

  constructor() { }

  ngOnInit(): void {
    console.log(111111, this.card)
    // const base64Image = this.arrayBufferToBase64(this.card.image.data);
    // console.log(base64Image)
    // // Set as background image style
    // this.imageURl = `data:image/jpeg;base64,${base64Image}`;
    // this.imageURl = `data:image/jpeg;base64,${this.card.image}`
    // const blob = this.base64ToBlob(this.card.image);
    // this.imageURl = URL.createObjectURL(blob);
    console.log(this.imageURl)
  }

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private base64ToBlob(base64: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray]);
  }

}
