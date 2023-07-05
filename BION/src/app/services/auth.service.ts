import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private registerUrl = 'http://localhost:3000/register';
  private loginUrl = 'http://localhost:3000/login';

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post<any>(this.registerUrl, user);
  }

  login(email: string, password: string): Observable<any> {
    const body = { emailAddress: email, password: password };
    return this.http.post<any>(this.loginUrl, body);
  }
}
