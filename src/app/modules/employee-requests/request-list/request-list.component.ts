import { Component, OnInit } from '@angular/core';
import {
  ActionType,
  EmployeeRequest,
  RequestStatus,
} from '../../../shared/interfaces/employee-request.model';
import { PagedResult } from '../../../shared/interfaces/PagesResult';
import { EmployeeRequestService } from '../../../shared/services/employee-request.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.css',
})
export class RequestListComponent implements OnInit {
  pagedData?: PagedResult<EmployeeRequest>;
  pageNumber = 1;
  pageSize = 10;
  isLoading = false;

  // Expose Enums to Template
  Status = RequestStatus;
  Action = ActionType;

  constructor(
    private requestService: EmployeeRequestService,
    private router: Router,
    private alert: AlertService,
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.requestService.getAll(this.pageNumber, this.pageSize).subscribe({
      next: (res) => {
        this.pagedData = res;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  // --- Logic Helpers ---

  parseOldData(oldDataString?: string): any {
    if (!oldDataString) return {};
    try {
      return JSON.parse(oldDataString);
    } catch {
      return {};
    }
  }

  hasChanged(req: EmployeeRequest, field: string): boolean {
    if (Number(req.actionType) !== ActionType.Update || !req.oldData)
      return false;
    const old = this.parseOldData(req.oldData);
    // Loose equality (!=) is intentional here to catch "5000" vs 5000
    return (req as any)[field] != old[field];
  }

  async onApprove(req: EmployeeRequest): Promise<void> {
    const confirmed = await this.alert.confirm(
      'Approve Request?',
      `Are you sure you want to approve the ${req.actionType} for ${req.fullName}?`,
      'Yes, Approve',
    );

    if (!confirmed) return;
    const actionType =
      typeof req.actionType === 'string'
        ? ActionType[req.actionType as keyof typeof ActionType]
        : req.actionType;

    let action$: Observable<any>;

    switch (actionType) {
      case ActionType.Create:
        action$ = this.requestService.approveCreate(req.id);
        break;

      case ActionType.Update:
        action$ = this.requestService.approveUpdate(req.id);
        break;

      case ActionType.Delete:
        action$ = this.requestService.approveDelete(req.id);
        break;

      default:
        alert('Unknown action type');
        return;
    }

    this.isLoading = true;

    action$.subscribe({
      next: () => {
        req.status = RequestStatus.Approved; // optimistic update
        this.isLoading = false;
        this.alert.toast('Request approved successfully!', 'success');
        this.loadRequests();
      },
      error: (err) => {
        console.error(err);
        this.alert.error(
          'Failed to approve',
          'Something went wrong on the server.',
        );
        this.isLoading = false;
      },
    });
  }

  onReject(req: EmployeeRequest): void {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return; // User cancelled

    this.isLoading = true;
    this.requestService.reject(req.id, reason).subscribe({
      next: () => {
        this.alert.success('Request rejected');
        req.status = RequestStatus.Rejected; // Update UI immediately
        req.rejectionReason = reason;
        this.isLoading = false;
        this.loadRequests();
      },
      error: (err) => {
        console.error(err);
        this.alert.error('Failed to reject request');
        this.isLoading = false;
      },
    });
  }
}
