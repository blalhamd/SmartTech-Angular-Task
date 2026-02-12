import { Component, OnDestroy, OnInit } from '@angular/core';
import { Employee } from '../../../shared/interfaces/employee.model';
import { PagedResult } from '../../../shared/interfaces/PagesResult';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../../../shared/services/employee.service';
import { Router } from '@angular/router';
import { EmployeeRequestService } from '../../../shared/services/employee-request.service';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  // Data Properties
  pagedData?: PagedResult<Employee>;
  pageNumber: number = 1;
  pageSize: number = 10;
  isLoading: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private employeeService: EmployeeService,
    private employeeRequestService: EmployeeRequestService,
    private router: Router,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  /**
   * Fetches the paged list of approved employees from the server.
   */
  loadEmployees(): void {
    this.isLoading = true;
    const sub = this.employeeService
      .getAll(this.pageNumber, this.pageSize)
      .subscribe({
        next: (response) => {
          this.pagedData = response;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching employees:', error);
          this.isLoading = false;
        },
      });

    this.subscription.add(sub);
  }

  /**
   * Updates the current page and reloads data.
   * @param newPage The page number to navigate to.
   */
  onPageChange(newPage: number): void {
    if (newPage >= 1 && newPage <= (this.pagedData?.totalPages || 1)) {
      this.pageNumber = newPage;
      this.loadEmployees();
    }
  }

  /**
   * Navigation to the Maker actions in the EmployeeRequests module.
   */
  onCreateRequest(): void {
    this.router.navigate(['/employee-requests/create']);
  }

  onUpdateRequest(employeeId: string): void {
    this.router.navigate(['/employee-requests/update', employeeId]);
  }

  onViewDetails(employeeId: string): void {
    this.router.navigate(['/employees/details', employeeId]);
  }

  async onDelete(empId: string) {
     const confirmed = await this.alert.confirm(
      'Delete Request?',
      `Are you sure you want to delete?`,
      'Yes, Delete',
    );

    if (!confirmed) return;
    const sub = this.employeeRequestService.raiseDelete(empId).subscribe({
      next: (res) => {
        console.log(res);
        this.alert.success('your request will review')
      },
      error: (error) => {
        console.log(Error(error?.error?.message));
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
