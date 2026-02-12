import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateEmployeeRequest, EmployeeRequest, UpdateEmployeeRequest } from '../interfaces/employee-request.model';
import { Observable } from 'rxjs';
import { PagedResult } from '../interfaces/PagesResult';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRequestService {

 private readonly baseUrl = `${environment.baseDomain}/api/v1/employee-requests`;

  constructor(private http: HttpClient) {}

  // Maker Actions
  create(dto: CreateEmployeeRequest): Observable<string> {
    return this.http.post<string>(this.baseUrl, dto);
  }

  raiseUpdate(employeeId: string, dto: UpdateEmployeeRequest): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/update/${employeeId}`, dto);
  }

  raiseDelete(employeeId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${employeeId}`);
  }

  // Checker Actions
  approveCreate(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/approve-create`, {});
  }

  approveUpdate(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/approve-update`, {});
  }

  approveDelete(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/approve-delete`, {});
  }

  reject(id: string, reason?: string): Observable<any> {
    const params = reason ? new HttpParams().set('reason', reason) : {};
    return this.http.patch(`${this.baseUrl}/${id}/reject`, {}, { params });
  }

  // Queries
  getAll(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<EmployeeRequest>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<EmployeeRequest>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<EmployeeRequest> {
    return this.http.get<EmployeeRequest>(`${this.baseUrl}/${id}`);
  }
}
