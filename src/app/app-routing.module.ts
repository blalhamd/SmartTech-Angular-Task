import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './shared/components/layouts/blank-layout/blank-layout.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';
import { permissionGuard } from './shared/guards/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: '',
    component: BlankLayoutComponent,
    canActivate: [permissionGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/employees/employees.module').then(
            (m) => m.EmployeesModule,
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('./modules/employee-requests/employee-requests.module').then(
            (m) => m.EmployeeRequestsModule,
          ),
      },
    ],
  },
  {
    path: 'un-authorized',
    component: UnauthorizedComponent,
    title: 'un-authorized',
  },
  { path: '**', component: NotfoundComponent, title: 'not found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
