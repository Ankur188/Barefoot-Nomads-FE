import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

  bookTrip(details: any) : Observable<any> {
    return this.http.post(`${environment.localhost}booking`, details);
  }

  getBookingDetails(id: string): Observable<any> {
    return this.http.get(`${environment.localhost}booking/${id}`)
  }
}
