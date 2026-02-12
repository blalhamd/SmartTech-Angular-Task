import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar-blank',
  templateUrl: './navbar-blank.component.html',
  styleUrl: './navbar-blank.component.css',
})
export class NavbarBlankComponent implements OnInit, OnDestroy {
  fullName: string = 'Guest';
  private sub = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Reactively update the name in the navbar
    this.sub.add(
      this.authService.fullName$.subscribe(name => this.fullName = name)
    );
  }

  // Wrapper for the template to check permissions
  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

  onSignOut(): void {
    this.authService.signOut();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
