import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
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
    name: ['', [Validators.required, this.nameValidator]],
    emailAddress: ['', [Validators.required, Validators.email]],
    countryCode: new FormControl('+91'), // set '+91' as default value
    phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    address: ['', [Validators.required, this.addressValidator]],
    city: ['', [Validators.required, this.cityStateValidator]],
    state: ['', [Validators.required, this.cityStateValidator]],
    pinCode: ['', [Validators.required, Validators.pattern(/^\d{5,6}$/)]],
    country: ['', [Validators.required, this.countryValidator.bind(this)]],
    password: ['', [Validators.required, this.passwordValidator]],
    securityQuestion: ['', Validators.required],
    securityAnswer: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        this.alphaNumericValidator,
      ],
    ],
  });

  countryCodes = helpers.countryCodes;
  filteredCountryCodes: Observable<any[]> = of([]);
  countryList = helpers.getCountryList();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  alphaNumericValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string') {
      return { alphaNumericValidator: true };
    }

    const trimmed = value.trim();

    if (trimmed.length < 2) {
      return { alphaNumericValidator: true };
    }

    if (!/^[a-z0-9 .]+$/i.test(trimmed)) {
      return { alphaNumericValidator: true };
    }

    return null;
  }

  nameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string') {
      return { nameValidator: true };
    }

    const trimmed = value.trim();

    if (trimmed.length < 2) {
      return { nameValidator: true };
    }

    if (!/^[a-z0-9 .]+$/i.test(trimmed)) {
      return { nameValidator: true };
    }

    return null;
  }

  addressValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (typeof value !== 'string') {
      return { addressValidator: true };
    }

    const trimmed = value.trim();

    if (trimmed.length < 2) {
      return { addressValidator: true };
    }

    if (!/^[\w\d\s.,-]+$/i.test(trimmed)) {
      return { addressValidator: true };
    }

    return null;
  }

  cityStateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string') {
      return { cityStateValidator: true };
    }

    const trimmed = value.trim();

    if (trimmed.length < 2) {
      return { cityStateValidator: true };
    }

    if (!/^[A-Za-z ]{2,}$/.test(trimmed)) {
      return { cityStateValidator: true };
    }

    return null;
  }

  countryValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string') {
      return { countryValidator: true };
    }

    const trimmed = helpers.titleCase(value.trim());

    if (trimmed.length < 2) {
      return { countryValidator: true };
    }

    if (!this.countryList.includes(trimmed)) {
      return { countryValidator: true };
    }

    return null;
  }

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

  ngOnInit(): void {
    // console.log('Country list is ');
    // console.log('Country List');
    // if (this.countryList.includes('India')) {
    //   console.log({ countryValidator: true });
    // }
    // this.countryList.forEach((ele) => {
    //   console.log(ele);
    // });

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

    //console.log('Submitted -> ', this.registerForm.value);

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
