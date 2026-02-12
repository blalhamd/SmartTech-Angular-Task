import { Component, OnDestroy, OnInit } from '@angular/core';
import { Employee } from '../../../shared/interfaces/employee.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../../shared/services/employee.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent implements OnInit, OnDestroy {
  employee?: Employee;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const employeeId = this.route.snapshot.paramMap.get('id');

    if (employeeId) {
      this.fetchEmployeeDetails(employeeId);
    } else {
      this.handleError('Invalid Employee ID provided.');
    }
  }

  /**
   * Fetches details for a specific employee from the API.
   */
  private fetchEmployeeDetails(id: string): void {
    this.isLoading = true;
    const sub = this.employeeService.getById(id).subscribe({
      next: (data) => {
        this.employee = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching employee details:', err);
        this.handleError('Could not find the requested employee.');
      }
    });

    this.subscription.add(sub);
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
