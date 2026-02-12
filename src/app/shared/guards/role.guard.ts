import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const roleGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data?.['roles'] as Array<string>;

  // Fix 1: Wrong bracket in URL path
  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  // Fix 2: Handle case when no roles are specified (open route)
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Fix 3: Ensure hasRole works properly (assuming it checks if user has at least one required role)
  if (authService.hasRole(requiredRoles)) {
    return true;
  }

  return router.createUrlTree(['/un-authorized']);
};
