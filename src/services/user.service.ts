import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface UserProfile {
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  emergencyContact?: string;
  gender?: string;
  profileImage?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<any> {
    return this.http.get(
      environment.production 
        ? '/api/user/profile' 
        : `${environment.apiURL}user/profile`
    );
  }

  updateUserProfile(profileData: UserProfile): Observable<any> {
    return this.http.put(
      environment.production 
        ? '/api/user/profile' 
        : `${environment.apiURL}user/profile`,
      profileData
    );
  }
}
