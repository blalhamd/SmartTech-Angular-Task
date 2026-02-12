import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { AppConstants } from '../constants/app-constants';
import { Router } from '@angular/router';

export const jwtTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getItem(AppConstants.TOKEN);
  if (token) {
    // will check about expiration
    if (!authService.isTokenExpired(token)) {
      const newReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next(newReq);
    } else {
      authService.removeItem(AppConstants.TOKEN);
      router.navigate(['/login']);
      return next(req);
    }
  }
  return next(req);
};
