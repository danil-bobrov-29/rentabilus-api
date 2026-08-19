import type { Request } from 'express';

export interface JwtRequestUser {
  id: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: JwtRequestUser;
}
