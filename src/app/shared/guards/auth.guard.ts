import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppConstants } from '../constants/app-constants';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getItem(AppConstants.TOKEN);
  if (token !== null && !authService.isTokenExpired(token)) {
    return true;
  } else {
    authService.removeItem(AppConstants.TOKEN);
    router.navigate(['/login']);
    return false;
  }
};
