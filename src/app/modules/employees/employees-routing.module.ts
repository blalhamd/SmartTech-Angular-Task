import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';

const routes: Routes = [
  {
    path: 'employees',
    component: EmployeeListComponent,
    data: { permission: 'Permissions.Employee.View' }
  },
  {
    path: 'employees/details/:id',
    component: EmployeeDetailsComponent,
    data: { permission: 'Permissions.Employee.ViewDetails' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
