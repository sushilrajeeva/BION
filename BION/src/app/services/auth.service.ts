import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private registerUrl = 'http://localhost:3000/register';
  private customerLoginUrl = 'http://localhost:3000/customer/login';
  private adminLoginUrl = 'http://localhost:3000/admin/login';

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post<any>(this.registerUrl, user);
  }

  login(email: string, password: string, admin: boolean): Observable<any> {
    const body = { emailAddress: email, password: password };
    const url = admin ? this.adminLoginUrl : this.customerLoginUrl;
    return this.http.post<any>(url, body);
  }
}
