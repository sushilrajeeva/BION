import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private adminBaseUrl = 'http://localhost:3000/admin';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }),
    };

    let url = this.adminBaseUrl + '/products/allproducts';

    return this.http.get<any>(url, httpOptions);
  }
}
