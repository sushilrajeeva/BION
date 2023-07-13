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
            console.log('Resonpse msg -> ', response);
            this.snackBar
              .open(response.successMsg, 'close', {
                duration: 3000,
              })
              .afterDismissed()
              .subscribe(() => {
                localStorage.setItem(
                  'sessionUser',
                  JSON.stringify(response.sessionUser)
                );
                this.loginStatusService.changeLoginStatus(true);
                this.loginStatusService.changeUserType(
                  response.sessionUser.userType
                );
                console.log(localStorage.getItem('sessionUser'));

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
