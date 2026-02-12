import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRequestsRoutingModule } from './employee-requests-routing.module';
import { RequestListComponent } from './request-list/request-list.component';
import { CreateRequestComponent } from './create-request/create-request.component';
import { UpdateRequestComponent } from './update-request/update-request.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RequestListComponent,
    CreateRequestComponent,
    UpdateRequestComponent
  ],
  imports: [
    CommonModule,
    EmployeeRequestsRoutingModule,
    ReactiveFormsModule
  ]
})
export class EmployeeRequestsModule { }
