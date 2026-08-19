import { PASSWORD_HASHER } from '@auth/application/ports/password-hasher';
import { TOKEN_SERVICE } from '@auth/application/ports/token-service';
import { GetCurrentUserUseCase } from '@auth/application/use-case/get-current-user.use-case';
import { LoginUseCase } from '@auth/application/use-case/login.use-case';
import { RegisterUseCase } from '@auth/application/use-case/register.use-case';
import { AUTH_REPOSITORY } from '@auth/domain/auth.repository';
import { PrismaAuthRepository } from '@auth/infrastructure/persistence/prisma-auth.repository';
import { ArgonPasswordHasher } from '@auth/infrastructure/security/argon-password-hasher';
import { JwtTokenService } from '@auth/infrastructure/security/jwt-token.service';
import { AuthController } from '@auth/presentation/http/auth.controller';
import { JwtAuthGuard } from '@auth/presentation/http/guards/jwt-auth.guard';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    GetCurrentUserUseCase,
    PrismaAuthRepository,
    ArgonPasswordHasher,
    JwtTokenService,
    JwtAuthGuard,
    {
      provide: AUTH_REPOSITORY,
      useExisting: PrismaAuthRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useExisting: ArgonPasswordHasher,
    },
    {
      provide: TOKEN_SERVICE,
      useExisting: JwtTokenService,
    },
  ],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
