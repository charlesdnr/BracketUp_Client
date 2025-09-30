import { User } from './user.model';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface TokenVerifyResponse {
  valid: boolean;
  user?: User;
  error?: string;
}