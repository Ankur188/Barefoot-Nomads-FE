import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';

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

  searchTrips(searchTerm: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-Skip-Loader': 'true'
    });
    return this.http.get(
      environment.production ? '/api/admin/trips' : `${environment.apiURL}admin/trips`,
      { params: { search: searchTerm }, headers }
    );
  }

  getTripById(tripId: string): Observable<any> {
    return this.http.get(
      environment.production ? `/api/admin/trips/${tripId}` : `${environment.apiURL}admin/trips/${tripId}`
    );
  }

  getBatchById(batchId: string): Observable<any> {
    return this.http.get(
      environment.production ? `/api/admin/batches/${batchId}` : `${environment.apiURL}admin/batches/${batchId}`
    );
  }

  getUsers(page: number = 1, limit: number = 20): Observable<any> {
    return this.http.get(
      environment.production ? '/api/admin/users' : `${environment.apiURL}admin/users`,
      { params: { page: page.toString(), limit: limit.toString() } }
    );
  }

  getCoupons(page: number = 1, limit: number = 20): Observable<any> {
    return this.http.get(
      environment.production ? '/api/admin/coupons' : `${environment.apiURL}admin/coupons`,
      { params: { page: page.toString(), limit: limit.toString() } }
    );
  }

  getBanners(): Observable<any> {
    return this.http.get(
      environment.production ? '/api/admin/banners' : `${environment.apiURL}admin/banners`
    );
  }

  createTrip(tripData: FormData): Observable<any> {
    return this.http.post(
      environment.production ? '/api/admin/trips' : `${environment.apiURL}admin/trips`,
      tripData
    );
  }

  createBatch(batchData: any): Observable<any> {
    return this.http.post(
      environment.production ? '/api/admin/batches' : `${environment.apiURL}admin/batches`,
      batchData
    );
  }

  updateBatch(batchId: string, batchData: any): Observable<any> {
    return this.http.put(
      environment.production ? `/api/admin/batches/${batchId}` : `${environment.apiURL}admin/batches/${batchId}`,
      batchData
    );
  }
}
