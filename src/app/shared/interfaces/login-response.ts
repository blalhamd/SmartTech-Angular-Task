export interface LoginResponse {
  userId: string;
  fullName: string;
  email: string;
  accessToken: string;
  accessTokenExpiration: Date;
  roles: string[];
}
