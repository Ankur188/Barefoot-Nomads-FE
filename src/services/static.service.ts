import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StaticService {
  private tripDetailsSubject = new BehaviorSubject<any>(null);
  tripDetails$ = this.tripDetailsSubject.asObservable();

  private tripsSubject = new BehaviorSubject<any>(null);
  trips$ = this.tripsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getTrips(): Observable<any> {
    if (this.tripsSubject.value) return of(this.tripsSubject.value);
    else
      return this.http
        .get(`${environment.localhost}trips`)
        .pipe(tap((data) => this.tripsSubject.next(data)));
  }

  signUpUser(postData: any): Observable<any> {
    return this.http.post(`${environment.localhost}users/signup`, postData);
  }

  loginUser(postData: any): Observable<any> {
    return this.http.post(`${environment.localhost}user/login`, postData);
  }

  getBanner(bannerName: string): Observable<any> {
    return this.http.get(
      `${environment.localhost}img/banner?name=${bannerName}`
    );
  }

  postEnquiry(postData): Observable<any> {
    return this.http.post(`${environment.localhost}trips/enquire`, postData);
  }

  getTripDetails(id: string) {
    if (this.tripDetailsSubject.value) return of(this.tripDetailsSubject.value);
    else
      return this.http
        .get(`${environment.localhost}trips/${id}`)
        .pipe(tap((data) => this.tripDetailsSubject.next(data)));
  }
}
