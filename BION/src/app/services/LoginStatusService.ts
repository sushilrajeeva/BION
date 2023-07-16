import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginStatusService {
  private loginStatus = new BehaviorSubject<boolean>(false);
  currentLoginStatus = this.loginStatus.asObservable();

  private userType = new BehaviorSubject<string>('');
  currentUserType = this.userType.asObservable();

  constructor() {}

  changeLoginStatus(status: boolean) {
    this.loginStatus.next(status);
  }

  changeUserType(type: string) {
    console.log('change user type is called', type);

    this.userType.next(type);
  }
}
