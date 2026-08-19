import { PASSWORD_HASHER } from '@auth/application/ports/password-hasher';
import type { PasswordHasher } from '@auth/application/ports/password-hasher';
import { TOKEN_SERVICE } from '@auth/application/ports/token-service';
import type { TokenService } from '@auth/application/ports/token-service';
import { AUTH_REPOSITORY } from '@auth/domain/auth.repository';
import type { AuthRepository } from '@auth/domain/auth.repository';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly repository: AuthRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    const email = input.email.trim().toLowerCase();
    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    if (!(await this.passwordHasher.verify(user.passwordHash, input.password))) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    return {
      accessToken: await this.tokenService.createAccessToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }
}
