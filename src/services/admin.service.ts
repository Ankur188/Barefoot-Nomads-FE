import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getBatches(page: number = 1, limit: number = 20): Observable<any> {
    return this.http.get(
      environment.production ? '/api/admin/batches' : `${environment.apiURL}admin/batches`,
      { params: { page: page.toString(), limit: limit.toString() } }
    );
  }

  getTrips(page: number = 1, limit: number = 20): Observable<any> {
    return this.http.get(
      environment.production ? '/api/admin/trips' : `${environment.apiURL}admin/trips`,
      { params: { page: page.toString(), limit: limit.toString() } }
    );
  }
}
