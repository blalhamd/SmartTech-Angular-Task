import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordRequest } from '../../../shared/interfaces/Reset-Password-Request';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
  isLoading: boolean = false;
  token: string | null = null;
  message = {
    success: '',
    error: '',
  };
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  get email() {
    return this.form.get('email');
  }

  get newPassword() {
    return this.form.get('newPassword');
  }

  ngOnInit(): void {
    this.buildForm();
    this.extractQueryParams();
  }

  private extractQueryParams(): void {
    const { token, email } = this.route.snapshot.queryParams;
    this.token = token ?? null;
    if (email) {
      this.form.patchValue({ email: email });
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      newPassword: [null, [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    this.resetMessages();

    if (this.form.invalid) {
      this.message.error = 'Please fill in all required fields correctly.';
      return;
    }

    this.isLoading = true;
    const payload: ResetPasswordRequest = {
      ...this.form.value,
      token: this.token,
    };

    this.authService.resetPassword(payload).subscribe({
      next: () => this.handleSuccess(),
      error: (err) => this.handleError(err),
    });
  }

  private handleSuccess(): void {
    this.isLoading = false;
    this.message.success = 'Password changed successfully. Redirecting...';
    setTimeout(() => {
      this.authService.signOut();
      this.router.navigate(['/login']);
    }, 2000);
  }

  private handleError(err: any): void {
    this.isLoading = false;
    this.message.error = err?.message || 'An error occurred. Please try again.';
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
