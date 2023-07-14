import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
  ValidationErrors,
  FormGroup,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import helpers from '../models/helpers';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string') {
      return { passwordValidator: true };
    }

    const trimmed = value.trim();

    if (trimmed.length < 8) {
      return { passwordValidator: true };
    }

    if (/\s/.test(trimmed)) {
      return { passwordValidator: true };
    }

    if (!/[A-Z]/.test(trimmed)) {
      return { passwordValidator: true };
    }

    if (!/[0-9]/.test(trimmed)) {
      return { passwordValidator: true };
    }

    if (!/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(trimmed)) {
      return { passwordValidator: true };
    }

    return null;
  }

  alphaNumericValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string') {
      return { alphaNumericValidator: true };
    }

    const trimmed = value.trim();

    if (trimmed.length < 2) {
      return { alphaNumericValidator: true };
    }

    if (!/^[a-z0-9\s]+$/i.test(trimmed)) {
      return { alphaNumericValidator: true };
    }

    return null;
  }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        ],
      ],
      securityQuestion: ['', Validators.required],
      securityAnswer: ['', [Validators.required, this.alphaNumericValidator]],
      newPassword: ['', [Validators.required, this.passwordValidator]],
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.authService
        .forgotPassword(
          this.forgotPasswordForm.value.email,
          this.forgotPasswordForm.value.securityQuestion,
          this.forgotPasswordForm.value.securityAnswer,
          this.forgotPasswordForm.value.newPassword
        )
        .subscribe(
          (response) => {
            this.snackBar
              .open(response.successMsg, 'close', {
                duration: 3000,
              })
              .afterDismissed()
              .subscribe(() => {
                this.router.navigate(['/homepage']);
              });
          },
          (error) => {
            let errorMessage = 'An error occurred.';
            if (error instanceof Error) {
              // Client-side error
              errorMessage = error.message;
            } else if (error.error && error.error.Error) {
              // Backend error
              errorMessage = error.error.Error;
            }
            this.snackBar.open(errorMessage, 'close', {
              duration: 3000,
            });
          }
        );
    }
  }
}
