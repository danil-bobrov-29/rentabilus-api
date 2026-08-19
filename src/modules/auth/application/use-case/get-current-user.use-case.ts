import type { PublicAuthUser } from '@auth/domain/auth-user';
import { toPublicAuthUser } from '@auth/domain/auth-user';
import type { AuthRepository } from '@auth/domain/auth.repository';
import { AUTH_REPOSITORY } from '@auth/domain/auth.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly repository: AuthRepository,
  ) {}

  async execute(userId: string): Promise<PublicAuthUser> {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return toPublicAuthUser(user);
  }
}
