export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface AuthUser {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  role: UserRole;
}

export type PublicAuthUser = Omit<AuthUser, 'passwordHash' | 'role'>;

export function toPublicAuthUser(user: AuthUser): PublicAuthUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: user.middleName,
  };
}
