import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarAuthComponent } from './components/navbar-auth/navbar-auth.component';
import { NavbarBlankComponent } from './components/navbar-blank/navbar-blank.component';
import { FooterComponent } from './components/footer/footer.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { SearchPipe } from './pipes/search.pipe';

@NgModule({
  declarations: [
    NavbarAuthComponent,
    NavbarBlankComponent,
    FooterComponent,
    UnauthorizedComponent,
    SearchPipe,
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    FooterComponent,
    NavbarAuthComponent,
    NavbarBlankComponent,
    CommonModule,
    UnauthorizedComponent,
    SearchPipe,
  ]
})
export class SharedModule {}
