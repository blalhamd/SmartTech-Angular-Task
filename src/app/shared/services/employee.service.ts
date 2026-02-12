import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Employee } from '../interfaces/employee.model';
import { Observable } from 'rxjs';
import { PagedResult } from '../interfaces/PagesResult';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly baseUrl = `${environment.baseDomain}/api/v1/employees`;

  constructor(private http: HttpClient) {}

  getAll(
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Observable<PagedResult<Employee>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<Employee>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }
}
