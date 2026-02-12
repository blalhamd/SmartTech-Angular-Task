import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeRequestService } from '../../../shared/services/employee-request.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrl: './create-request.component.css'
})
export class CreateRequestComponent {
  requestForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private requestService: EmployeeRequestService,
    private router: Router,
    private alert: AlertService
  ) {
    this.requestForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      salary: [0, [Validators.required, Validators.min(1)]],
      position: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.requestForm.invalid) return;

    this.isSubmitting = true;
    this.requestService.create(this.requestForm.value).subscribe({
      next: () => {
        this.alert.success('Creation request submitted for approval.')
        this.router.navigate(['/employees']);
      },
      error: () => this.isSubmitting = false
    });
  }
}
