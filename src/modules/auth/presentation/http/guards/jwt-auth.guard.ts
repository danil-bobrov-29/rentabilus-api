import { TOKEN_SERVICE } from '@auth/application/ports/token-service';
import type { TokenService } from '@auth/application/ports/token-service';
import { UserRole } from '@auth/domain/auth-user';
import type { AuthenticatedRequest } from '@auth/presentation/http/types/authenticated-request';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedException('Требуется Bearer-токен');
    }

    try {
      const payload = await this.tokenService.verifyAccessToken(token);

      if (!Object.values(UserRole).includes(payload.role)) {
        throw new UnauthorizedException();
      }

      request.user = { id: payload.sub, email: payload.email, role: payload.role };
      return true;
    } catch {
      throw new UnauthorizedException('Недействительный или истёкший токен');
    }
  }

  private extractBearerToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
