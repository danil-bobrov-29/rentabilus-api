export interface AuthUser {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  position: string | null;
}

export type PublicAuthUser = Omit<AuthUser, 'passwordHash'>;

export function toPublicAuthUser(user: AuthUser): PublicAuthUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: user.middleName,
    position: user.position,
  };
}
