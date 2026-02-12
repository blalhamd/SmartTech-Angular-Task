import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './blank-layout/blank-layout.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    BlankLayoutComponent,
    AdminLayoutComponent,
  ],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [AuthLayoutComponent, BlankLayoutComponent],
})
export class LayoutsModule {}
