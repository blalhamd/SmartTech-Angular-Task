import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../../shared/services/employee.service';
import { EmployeeRequestService } from '../../../shared/services/employee-request.service';
import { UpdateEmployeeRequest } from '../../../shared/interfaces/employee-request.model';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-update-request',
  templateUrl: './update-request.component.html',
  styleUrl: './update-request.component.css'
})
export class UpdateRequestComponent implements OnInit {
  updateForm: FormGroup;
  employeeId!: string;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private requestService: EmployeeRequestService,
    private router: Router,
    private alert: AlertService
  ) {
    this.updateForm = this.fb.group({
      fullName: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(1)]],
      position: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('employeeId')!;
    this.employeeService.getById(this.employeeId).subscribe(emp => {
      this.updateForm.patchValue(emp);
      this.isLoading = false;
    });
  }

  onSubmit(): void {
    if (this.updateForm.invalid) return;

    const dto: UpdateEmployeeRequest = {
      employeeId: this.employeeId,
      fullName: this.updateForm.value.fullName,
      salary: this.updateForm.value.salary,
      position: this.updateForm.value.position
    };

    this.requestService.raiseUpdate(this.employeeId, dto).subscribe({
      next: () => {
        this.alert.success('Update request submitted for approval.');
        this.router.navigate(['/employees']);
      }
    });
  }
}
