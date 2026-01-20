import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getBatches(): Observable<any> {
    return this.http.get(
      environment.production ? '/api/admin/batches' : `${environment.apiURL}admin/batches`
    );
  }
}
