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
    console.log(localStorage['isUserLoggedIn'], sessionStorage['bn_access'])
    if (localStorage['isUserLoggedIn'] && sessionStorage['bn_access']) {
      this.userName = localStorage['userName'];
      this.isUserLoggedIn = true;
    }
  }

  signUpUser(postData: any): Observable<any> {
    return this.http.post( environment.production ? '/api/users/signup' :`${environment.apiURL}users/signup`, postData);
  }

  loginUser(postData: any): Observable<any> {
    return this.http.post( environment.production ? '/api/user/login' :`${environment.apiURL}user/login`, postData);
  }
}
