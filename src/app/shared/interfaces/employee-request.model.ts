export enum ActionType {
  Create = 1,
  Update = 2,
  Delete = 3
}

export enum RequestStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3
}

export interface EmployeeRequest {
  id: string;
  employeeId?: string;
  actionType: ActionType;
  status: RequestStatus;
  fullName?: string;
  email?: string;
  salary?: number;
  position?: string;
  rejectionReason?: string;
  oldData?: string; // JSON string
}

export interface CreateEmployeeRequest {
  fullName: string;
  salary: number;
  position: string;
  email: string;
}

export interface UpdateEmployeeRequest {
  employeeId: string;
  fullName: string;
  salary: number;
  position: string;
}
