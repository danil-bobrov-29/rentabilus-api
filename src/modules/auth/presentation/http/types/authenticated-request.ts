import type { UserRole } from '@auth/domain/auth-user';
import type { Request } from 'express';

export interface JwtRequestUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user: JwtRequestUser;
}
