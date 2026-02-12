import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { LoginDto } from '../../../shared/interfaces/login.dto';
import { AppConstants } from '../../../shared/constants/app-constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  model!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  get email() {
    return this.model.get('email');
  }

  get password() {
    return this.model.get('password');
  }

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    const token = authService.getItem(AppConstants.TOKEN);
    if (token && !authService.isTokenExpired(token)) {
      router.navigate(['/employees']);
    }
  }

  ngOnInit(): void {
    this.buildLoginForm();
  }

  // build login form
  buildLoginForm() {
    this.model = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    this.isLoading = true;
    //check because someone may remove disabled attribute from inspect and send data
    if (this.model.valid) {
      const payLoad: LoginDto = {
        email: this.model.value.email,
        password: this.model.value.password,
      };
      this.authService.login(payLoad).subscribe({
        next: (res) => {
          console.log(res);
          this.isLoading = false;
          this.successMessage = 'Login successful!';
          this.authService.setItem(AppConstants.TOKEN, res.accessToken);
          this.authService.updateUserName(res.fullName);
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          this.isLoading = false;
          console.log(Error(err?.error));
          this.errorMessage = err?.error?.message || 'Login failed, try again.';
        },
      });
    }
  }

  reset() {
    this.model.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }
}
