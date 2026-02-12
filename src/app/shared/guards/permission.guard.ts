import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Check if user is logged in
  if (!authService.isLoggedIn()) {
    authService.signOut();
    return false;
  }

  // 2. Get required permission from route data
  const requiredPermission = route.data['permission'] as string;

  // 3. If no permission is required for this route, allow access
  if (!requiredPermission) return true;

  // 4. Check if user has the specific permission
  if (authService.hasPermission(requiredPermission)) {
    return true;
  }

  // 5. Redirect to unauthorized if they don't have access
  router.navigate(['/un-authorized']);
  return false;
};
