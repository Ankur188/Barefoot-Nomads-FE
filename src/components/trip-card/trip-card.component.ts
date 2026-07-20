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
    console.log('card', this.card);
  }

  isRecentlyAdded(): boolean {
    if (!this.card?.lowestPriceBatch?.created_at) {
      return false;
    }
    
    const createdAt = this.card.lowestPriceBatch.created_at * 1000; // Convert timestamp to milliseconds
    const now = Date.now();
    const fourteenDaysInMs = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
    
    return (now - createdAt) < fourteenDaysInMs;
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
