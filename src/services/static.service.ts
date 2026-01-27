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
        .get( environment.production ? '/api/trips' : `${environment.apiURL}trips`)
        .pipe(tap((data) => this.tripsSubject.next(data)));
  }

  getBanner(bannerName: string): Observable<any> {
    return this.http.get(
      environment.production ? `/api/img/banner?name=${bannerName}` : `${environment.apiURL}img/banner?name=${bannerName}`
    );
  }

  postEnquiry(postData): Observable<any> {
    return this.http.post(environment.production ? `/api/trips/enquire` : `${environment.apiURL}trips/enquire`, postData);
  }

  getTripDetails(id: string) {
    if (this.tripDetailsSubject.value && this.tripDetailsSubject.value.id === id) return of(this.tripDetailsSubject.value);
    else
      return this.http
        .get(environment.production ? `/api/trips/${id}` : `${environment.apiURL}trips/${id}`)
        .pipe(tap((data) => this.tripDetailsSubject.next(data)));
  }

  getBatches(id: string, page:number = 1, filter='All'): Observable<any> {
    if(filter === 'All')
      return this.http
        .get(environment.production ? `/api/trips/${id}/batches?page=${page}` : `${environment.apiURL}trips/${id}/batches?page=${page}`)
        else {
                return this.http
        .get(environment.production ? `/api/trips/${id}/batches?page=${page}&month=${filter +1}` : `${environment.apiURL}trips/${id}/batches?page=${page}&month=${filter +1}`)
        }
  }
}
