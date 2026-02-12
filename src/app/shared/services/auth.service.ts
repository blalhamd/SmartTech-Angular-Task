import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginResponse } from '../interfaces/login-response';
import { LoginDto } from '../interfaces/login.dto';
import { AppConstants } from '../constants/app-constants';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { ForgotPasswordRequest } from '../interfaces/Forgot-Password-Request';
import { ResetPasswordRequest } from '../interfaces/Reset-Password-Request';
import { Router } from '@angular/router';

interface JwtPayload {
  exp: number; // expiry timestamp
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = `${environment.baseDomain}/api/v1/auth`;
  private isBrowser: boolean;
  private _fullName = new BehaviorSubject<string>('Guest');
  fullName$ = this._fullName.asObservable(); // to enable subscribe it
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    console.log(this.getUserRoles());
    console.log(this.getUserPermissions());
  }

  login(model: LoginDto): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.baseUrl}/login`, model);
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<string> {
    return this.httpClient.post(`${this.baseUrl}/forgot-password`, request, {
      responseType: 'text',
    });
  }

  resetPassword(request: ResetPasswordRequest): Observable<boolean> {
    return this.httpClient.post<boolean>(
      `${this.baseUrl}/reset-password`,
      request
    );
  }

  updateUserName(name: string) {
    this._fullName.next(name);
  }

  isLoggedIn(): boolean {
    // Check if token exists and is not expired
    const token = this.getItem(AppConstants.TOKEN);
    return !!token && !this.isTokenExpired(token); // Implement isTokenExpired() if needed
  }

  getUserRoles(): string[] {
    const encodedToken = this.getItem(AppConstants.TOKEN);
    if (!encodedToken) return [];

    try {
      const decodedToken: any = jwtDecode(encodedToken);
      const rolesClaim = decodedToken['roles'];

      if (!rolesClaim) return [];

      // Ensure it always returns an array
      return Array.isArray(rolesClaim) ? rolesClaim : [rolesClaim];
    } catch (error) {
      console.error('Invalid or expired token:', error);
      return [];
    }
  }

  getUserPermissions(): string[] {
    const encodedToken = this.getItem(AppConstants.TOKEN);
    if (!encodedToken) return [];

    try {
      const decodedToken: any = jwtDecode(encodedToken);
      // Ensure the claim name matches your Backend (e.g., 'permissions')
      const permissionsClaim = decodedToken['permissions'];

      if (!permissionsClaim) return [];

      return Array.isArray(permissionsClaim) ? permissionsClaim : [permissionsClaim];
    } catch (error) {
      return [];
    }
  }

  hasRole(allowedRoles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return allowedRoles.some((role) => userRoles.includes(role));
  }

  /**
   * Checks if the user has a specific permission.
   * Useful for both Guards and UI (hiding/showing links).
   */
  hasPermission(permission: string): boolean {
    const userPermissions = this.getUserPermissions();
    return userPermissions.includes(permission);
  }

  getItem(key: string): string | null {
    return this.isBrowser ? localStorage.getItem(key) : null;
  }

  setItem(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }

  removeItem(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }

  isTokenExpired(token: string): boolean {
    if (!token) return true;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const expiry = decoded.exp * 1000;
      return Date.now() > expiry;
    } catch (e) {
      console.error('Invalid token', e);
      return true;
    }
  }

  clear(): void {
    if (this.isBrowser) {
      localStorage.clear();
    }
  }

  signOut() {
    const token = this.getItem(AppConstants.TOKEN);
    this.removeItem(AppConstants.TOKEN);
    this.router.navigate(['/login']);
  }

  private getTokenExpirationTime(token: string): number {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000;
  }
}
