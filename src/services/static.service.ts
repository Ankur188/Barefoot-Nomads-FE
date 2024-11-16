import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaticService {

  private tripsSubject = new Subject<any>();
  trips$ = this.tripsSubject.asObservable();

  constructor(private http : HttpClient) { }

  getTrips () {
    return this.http.get(`${environment.localhost}trips`).subscribe(data => {
      this.tripsSubject.next(data['trips']);
    });
  }

  signUpUser(postData: any): Observable<any> {
    return this.http.post(`${environment.localhost}users/signup`, postData);
  }

  loginUser(postData: any): Observable<any> {
    return this.http.post(`${environment.localhost}user/login`, postData);
  }
}
