import type { UserRole } from '@auth/domain/auth-user';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');

export interface TokenService {
  createAccessToken(payload: AccessTokenPayload): Promise<string>;
  verifyAccessToken(token: string): Promise<AccessTokenPayload>;
}
