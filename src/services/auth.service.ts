import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isUserLoggedIn = false;
  userName = '';

  constructor(private http: HttpClient) {
    if (localStorage['isUserLoggedIn'] && sessionStorage['bn_access']) {
      this.userName = localStorage['userName'];
      this.isUserLoggedIn = true;
    }
  }

  signUpUser(postData: any): Observable<any> {
    return this.http.post(`${environment.localhost}users/signup`, postData);
  }

  loginUser(postData: any): Observable<any> {
    return this.http.post(`${environment.localhost}user/login`, postData);
  }
}
