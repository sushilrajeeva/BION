import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  sessionUser: any;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.updateSessionUser();
  }

  updateSessionUser(): void {
    const storedUser = localStorage.getItem('sessionUser');
    this.sessionUser = storedUser ? JSON.parse(storedUser) : null;
  }

  logout(): void {
    localStorage.removeItem('sessionUser');
    this.sessionUser = null;
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
