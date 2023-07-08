import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginStatusService } from '../services/LoginStatusService';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  sessionUser: any;
  isLoggedIn: boolean = false;
  userType: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private loginStatusService: LoginStatusService
  ) {}

  ngOnInit(): void {
    this.updateSessionUser();
    this.loginStatusService.currentLoginStatus.subscribe(
      (status) => (this.isLoggedIn = status)
    );
    this.loginStatusService.currentUserType.subscribe(
      (type) => (this.userType = type)
    );
  }

  updateSessionUser(): void {
    const storedUser = localStorage.getItem('sessionUser');
    this.sessionUser = storedUser ? JSON.parse(storedUser) : null;
    this.isLoggedIn = !!this.sessionUser;
    this.userType = this.sessionUser ? this.sessionUser.userType : '';
  }

  logout(): void {
    localStorage.removeItem('sessionUser');
    this.sessionUser = null;
    this.loginStatusService.changeLoginStatus(false);
    this.loginStatusService.changeUserType('');
    this.http.get('http://localhost:3000/logout').subscribe(
      (response) => {
        console.log('Logout successful.');
        this.router.navigate(['/']); // navigate to homepage after logout
      },
      (error) => {
        console.log('Error during logout.', error);
      }
    );
  }
}
