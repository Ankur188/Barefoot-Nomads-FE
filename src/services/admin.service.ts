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

  getLeads(page: number = 1, limit: number = 20): Observable<any> {
    return this.http.get(
      environment.production ? '/api/admin/leads' : `${environment.apiURL}admin/leads`,
      { params: { page: page.toString(), limit: limit.toString() } }
    );
  }

  getCouponById(couponId: string): Observable<any> {
    return this.http.get(
      environment.production ? `/api/admin/coupons/${couponId}` : `${environment.apiURL}admin/coupons/${couponId}`
    );
  }

  createCoupon(couponData: any): Observable<any> {
    return this.http.post(
      environment.production ? '/api/admin/coupons' : `${environment.apiURL}admin/coupons`,
      couponData
    );
  }

  updateCoupon(couponId: string, couponData: any): Observable<any> {
    return this.http.put(
      environment.production ? `/api/admin/coupons/${couponId}` : `${environment.apiURL}admin/coupons/${couponId}`,
      couponData
    );
  }

  deleteCoupon(couponId: string): Observable<any> {
    return this.http.delete(
      environment.production ? `/api/admin/coupons/${couponId}` : `${environment.apiURL}admin/coupons/${couponId}`
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

  updateTrip(tripId: string, tripData: any): Observable<any> {
    return this.http.put(
      environment.production ? `/api/admin/trips/${tripId}` : `${environment.apiURL}admin/trips/${tripId}`,
      tripData
    );
  }

  updateBatch(batchId: string, batchData: any): Observable<any> {
    return this.http.put(
      environment.production ? `/api/admin/batches/${batchId}` : `${environment.apiURL}admin/batches/${batchId}`,
      batchData
    );
  }

  deleteBatch(batchId: string): Observable<any> {
    return this.http.delete(
      environment.production ? `/api/admin/batches/${batchId}` : `${environment.apiURL}admin/batches/${batchId}`
    );
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(
      environment.production ? '/api/admin/users' : `${environment.apiURL}admin/users`,
      userData
    );
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(
      environment.production ? `/api/admin/users/${userId}` : `${environment.apiURL}admin/users/${userId}`
    );
  }

  deleteLead(leadId: string): Observable<any> {
    return this.http.delete(
      environment.production ? `/api/admin/leads/${leadId}` : `${environment.apiURL}admin/leads/${leadId}`
    );
  }

  uploadBannerImage(bannerId: string, formData: FormData): Observable<any> {
    return this.http.put(
      environment.production ? `/api/admin/banners/${bannerId}/image` : `${environment.apiURL}admin/banners/${bannerId}/image`,
      formData
    );
  }

  // Booking APIs
  getBookings(page: number = 1, limit: number = 20): Observable<any> {
    return this.http.get(
      environment.production ? '/api/admin/bookings' : `${environment.apiURL}admin/bookings`,
      { params: { page: page.toString(), limit: limit.toString() } }
    );
  }

  getBookingById(bookingId: string): Observable<any> {
    return this.http.get(
      environment.production ? `/api/admin/bookings/${bookingId}` : `${environment.apiURL}admin/bookings/${bookingId}`
    );
  }

  createBooking(bookingData: any): Observable<any> {
    return this.http.post(
      environment.production ? '/api/admin/bookings' : `${environment.apiURL}admin/bookings`,
      bookingData
    );
  }

  updateBooking(bookingId: string, bookingData: any): Observable<any> {
    return this.http.put(
      environment.production ? `/api/admin/bookings/${bookingId}` : `${environment.apiURL}admin/bookings/${bookingId}`,
      bookingData
    );
  }

  deleteBooking(bookingId: string): Observable<any> {
    return this.http.delete(
      environment.production ? `/api/admin/bookings/${bookingId}` : `${environment.apiURL}admin/bookings/${bookingId}`
    );
  }

  getBookingInvoice(bookingId: string): Observable<any> {
    return this.http.get(
      environment.production ? `/api/admin/bookings/${bookingId}/invoice` : `${environment.apiURL}admin/bookings/${bookingId}/invoice`
    );
  }

  searchUsers(searchTerm: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-Skip-Loader': 'true'
    });
    return this.http.get(
      environment.production ? '/api/admin/users' : `${environment.apiURL}admin/users`,
      { params: { search: searchTerm }, headers }
    );
  }

  searchBatches(searchTerm: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-Skip-Loader': 'true'
    });
    return this.http.get(
      environment.production ? '/api/admin/batches' : `${environment.apiURL}admin/batches`,
      { params: { search: searchTerm }, headers }
    );
  }
}
