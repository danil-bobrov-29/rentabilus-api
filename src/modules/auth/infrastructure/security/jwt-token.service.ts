import { AccessTokenPayload, TokenService } from '@auth/application/ports/token-service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService implements TokenService {
  private readonly secret: string;
  private readonly expiresIn: number;

  constructor(
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.secret = configService.getOrThrow<string>('JWT_ACCESS_SECRET');
    this.expiresIn = Number(configService.get<string>('JWT_ACCESS_TTL_SECONDS') ?? 900);
  }

  createAccessToken(payload: AccessTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.secret,
      expiresIn: this.expiresIn,
    });
  }

  verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    return this.jwtService.verifyAsync<AccessTokenPayload>(token, {
      secret: this.secret,
    });
  }
}
