import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import helpers from '../models/helpers';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm = this.formBuilder.group({
    name: ['', Validators.required],
    emailAddress: ['', [Validators.required, Validators.email]],
    countryCode: new FormControl('+91'), // set '+91' as default value
    phoneNumber: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pinCode: ['', Validators.required],
    country: ['', Validators.required],
    password: ['', Validators.required],
  });

  countryCodes = helpers.countryCodes;
  filteredCountryCodes: Observable<any[]> = of([]);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const countryCodeControl = this.registerForm.get('countryCode');
    if (countryCodeControl) {
      this.filteredCountryCodes = countryCodeControl.valueChanges.pipe(
        startWith(''),
        map((value: string | any) =>
          typeof value === 'object' && value.dial_code ? value.dial_code : value
        ),
        map((dial_code: string) =>
          dial_code ? this._filter(dial_code) : this.countryCodes.slice()
        )
      );
    }
  }

  displayCountry(country: any): string {
    return country && country.dial_code ? country.dial_code : '';
  }
  displayCountryCode(country: any): string {
    return country && typeof country === 'object'
      ? country?.dial_code ?? ''
      : '';
  }

  private _filter(dial_code: string): any[] {
    const filterValue = dial_code.toLowerCase();
    return this.countryCodes.filter(
      (country) =>
        country.name.toLowerCase().includes(filterValue) ||
        country.dial_code.includes(filterValue)
    );
  }

  onSubmit(): void {
    let countryCode: any = this.registerForm.value.countryCode;
    let selectedCountry: any = null;

    if (typeof countryCode === 'object') {
      selectedCountry = countryCode;
      countryCode = countryCode?.dial_code ?? '';
    }

    if (!countryCode || countryCode === '') {
      countryCode = '+91'; // Set default value as '+91'
    }

    this.registerForm.patchValue({ countryCode: countryCode });

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) =>
        this.snackBar
          .open('Registration Successful', 'Close', {
            duration: 3000,
          })
          .afterDismissed()
          .subscribe(() => {
            this.router.navigate(['/homepage']); // Replace '/home' with the actual path to your homepage component
          }),
      error: (error) =>
        this.snackBar
          .open('Registration Failed', 'Close', {
            duration: 3000,
          })
          .afterDismissed()
          .subscribe(() => {
            this.router.navigate(['/homepage']); // Replace '/home' with the actual path to your homepage component
          }),
    });
  }
}
