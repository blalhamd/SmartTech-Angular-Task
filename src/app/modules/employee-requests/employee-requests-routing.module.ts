import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestListComponent } from './request-list/request-list.component';
import { CreateRequestComponent } from './create-request/create-request.component';
import { UpdateRequestComponent } from './update-request/update-request.component';

const routes: Routes = [
  {
    path: 'employee-requests',
    component: RequestListComponent,
    data: { permission: 'Permissions.EmployeeRequest.View' }
  },
  {
    path: 'employee-requests/create',
    component: CreateRequestComponent,
    data: { permission: 'Permissions.EmployeeRequest.Create' }
  },
  {
    path: 'employee-requests/update/:employeeId',
    component: UpdateRequestComponent,
    data: { permission: 'Permissions.EmployeeRequest.Update' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRequestsRoutingModule { }
