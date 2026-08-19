import { AuthUser } from './auth-user';

export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY');

export interface CreateAuthUser {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  middleName?: string;
}

export interface AuthRepository {
  findByEmail(email: string): Promise<AuthUser | null>;
  findById(id: string): Promise<AuthUser | null>;
  create(input: CreateAuthUser): Promise<AuthUser>;
}
