import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaticService {

  private tripsSubject = new Subject<any>();
  trips$ = this.tripsSubject.asObservable();

  constructor(private http : HttpClient) { }

  createImageFromBlob(image: Blob): void {
    const reader = new FileReader();
    let imageUrl;
    reader.addEventListener('load', () => {
      imageUrl = reader.result as string;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }

    return imageUrl;
  }

  getTrips () {
    return this.http.get(`${environment.localhost}trips`).subscribe(data => {
      this.tripsSubject.next(data['trips']);
    });
  }
}
