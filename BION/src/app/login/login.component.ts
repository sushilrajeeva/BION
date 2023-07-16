import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginStatusService } from '../services/LoginStatusService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private loginStatusService: LoginStatusService
  ) {}

  ngOnInit(): void {
    console.log('Login componennet called!');

    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]).*$/
          ),
        ],
      ],
      admin: [false],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService
        .login(
          this.loginForm.value.email,
          this.loginForm.value.password,
          this.loginForm.value.admin
        )
        .subscribe(
          (response) => {
            console.log('Response msg -> ', response);
            const token = response.body.token; // Get the JWT token from the response
            const successMsg = response.body.successMsg;
            const sessionUser = response.body.sessionUser;
            sessionStorage.setItem('token', token); // Save the JWT token to sessionStorage

            sessionStorage.setItem('sessionUser', JSON.stringify(sessionUser)); // Save the sessionUser to sessionStorage

            this.snackBar
              .open(successMsg, 'close', {
                duration: 3000,
              })
              .afterDismissed()
              .subscribe(() => {
                this.loginStatusService.changeLoginStatus(true);
                console.log(
                  'fROM LOGIN USER TYPE ',
                  JSON.stringify(sessionUser.userType)
                );

                this.loginStatusService.changeUserType(sessionUser.userType);
                console.log(sessionStorage.getItem('sessionUser'));
                console.log(sessionStorage.getItem('token'));

                this.router.navigate(['/homepage']); // Replace '/home' with the actual path to your homepage component
              });
            // here, you can redirect to another page or do other things
            // this.router.navigateByUrl('/some-page');
          },
          (error) => {
            this.snackBar.open('Failed to log in.', 'close', {
              duration: 3000,
            });
          }
        );
    }
  }
}
