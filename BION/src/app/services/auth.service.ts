import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
    return this.http.post<any>(url, body, { observe: 'response' }); // observe response to get all response data including headers
  }

  forgotPassword(
    email: string,
    securityQuestion: string,
    securityAnswer: string,
    newPassword: string
  ): Observable<any> {
    const body = {
      emailAddress: email,
      securityQuestion: securityQuestion,
      securityAnswer: securityAnswer,
      newPassword: newPassword,
    };
    const url = 'http://localhost:3000/customer/forgotPassword';
    return this.http.post<any>(url, body).pipe(
      catchError((error) => {
        console.log('logging error', error.error.Error);

        throw new Error(error.error.Error); // Throw the error with the error message
      })
    );
  }
}
