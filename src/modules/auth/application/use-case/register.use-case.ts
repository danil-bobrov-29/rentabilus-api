import type { PasswordHasher } from '@auth/application/ports/password-hasher';
import { PASSWORD_HASHER } from '@auth/application/ports/password-hasher';
import type { TokenService } from '@auth/application/ports/token-service';
import { TOKEN_SERVICE } from '@auth/application/ports/token-service';
import type { PublicAuthUser } from '@auth/domain/auth-user';
import { toPublicAuthUser } from '@auth/domain/auth-user';
import { EmailAlreadyExistsError } from '@auth/domain/auth.errors';
import type { AuthRepository } from '@auth/domain/auth.repository';
import { AUTH_REPOSITORY } from '@auth/domain/auth.repository';
import { ConflictException, Inject, Injectable } from '@nestjs/common';

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName?: string;
}

export interface RegisterResult {
  accessToken: string;
  user: PublicAuthUser;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly repository: AuthRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterResult> {
    const email = input.email.trim().toLowerCase();

    const existingUser = await this.repository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Пользователь уже существует');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    let user;

    try {
      user = await this.repository.create({
        email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        middleName: input.middleName,
      });
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        throw new ConflictException('Пользователь уже существует');
      }

      throw error;
    }

    const accessToken = await this.tokenService.createAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user: toPublicAuthUser(user),
    };
  }
}
