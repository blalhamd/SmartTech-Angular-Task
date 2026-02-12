import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { ForgotPasswordRequest } from '../../../shared/interfaces/Forgot-Password-Request';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgetPasswordComponent implements OnInit {
  form!: FormGroup;
  isLoading: boolean = false;
  message = {
    success: '',
    error: '',
  };
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  get email() {
    return this.form.get('email');
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    this.resetMessages();
    if (this.form.invalid) {
      this.message.error = 'Please fill in all required fields correctly.';
      return;
    }

    this.isLoading = true;
    const payload: ForgotPasswordRequest = { ...this.form.value };
    this.authService.forgotPassword(payload).subscribe({
      next: (token) => {
        console.log(this.form.value);
        this.isLoading = false;
        this.message.success = 'Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/reset-password'], {
            queryParams: { token: token, email: this.email?.value },
          });
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error =
          err?.message || 'An error occurred. Please try again.';
      },
    });
  }

  resetForm(): void {
    this.form.reset();
    this.resetMessages();
  }

  resetMessages() {
    this.message = {
      error: '',
      success: '',
    };
  }
}
