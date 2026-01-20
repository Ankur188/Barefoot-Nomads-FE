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
  userRole = '';

  constructor(private http: HttpClient) {
    console.log(localStorage['isUserLoggedIn'], sessionStorage['bn_access'])
    if (localStorage['isUserLoggedIn'] && sessionStorage['bn_access']) {
      this.userName = localStorage['userName'];
      this.userRole = localStorage['userRole'] || '';
      this.isUserLoggedIn = true;
    }
  }

  isAdmin(): boolean {
    return this.userRole && this.userRole.toLowerCase() === 'admin';
  }

  signUpUser(postData: any): Observable<any> {
    return this.http.post( environment.production ? '/api/users/signup' :`${environment.apiURL}users/signup`, postData);
  }

  loginUser(postData: any): Observable<any> {
    return this.http.post( environment.production ? '/api/user/login' :`${environment.apiURL}user/login`, postData);
  }

  refreshToken(): Observable<any> {
    const refreshToken = sessionStorage.getItem('bn_refresh');
    return this.http.post(
      environment.production ? '/api/user/refresh-token' : `${environment.apiURL}user/refresh-token`,
      { refreshToken }
    );
  }

  isTokenValid(): boolean {
    const token = sessionStorage.getItem('bn_access');
    const isLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';
    return !!(token && isLoggedIn);
  }

  clearAuthData(): void {
    localStorage.removeItem('isUserLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('email');
    localStorage.removeItem('id');
    sessionStorage.removeItem('bn_access');
    sessionStorage.removeItem('bn_refresh');
    this.isUserLoggedIn = false;
    this.userName = '';
    this.userRole = '';
  }
}
