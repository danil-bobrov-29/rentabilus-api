import { GetCurrentUserUseCase } from '@auth/application/use-case/get-current-user.use-case';
import type { LoginResult } from '@auth/application/use-case/login.use-case';
import { LoginUseCase } from '@auth/application/use-case/login.use-case';
import type { RegisterResult } from '@auth/application/use-case/register.use-case';
import { RegisterUseCase } from '@auth/application/use-case/register.use-case';
import type { PublicAuthUser } from '@auth/domain/auth-user';
import { JwtAuthGuard } from '@auth/presentation/http/guards/jwt-auth.guard';
import type { JwtRequestUser } from '@auth/presentation/http/types/authenticated-request';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from './decorators/current-user.decorator';
import {
  AccessTokenResponseDto,
  AuthUserResponseDto,
  RegisterResponseDto,
} from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiCreatedResponse({
    description: 'Пользователь зарегистрирован',
    type: RegisterResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Некорректные данные запроса' })
  @ApiConflictResponse({ description: 'Пользователь уже существует' })
  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<RegisterResult> {
    return this.registerUseCase.execute(dto);
  }

  @ApiOperation({ summary: 'Вход по email и паролю' })
  @ApiOkResponse({ description: 'Авторизация выполнена', type: AccessTokenResponseDto })
  @ApiBadRequestResponse({ description: 'Некорректные данные запроса' })
  @ApiUnauthorizedResponse({ description: 'Неверный email или пароль' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<LoginResult> {
    return this.loginUseCase.execute(dto);
  }

  @ApiOperation({ summary: 'Получение текущего пользователя' })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ description: 'Текущий пользователь', type: AuthUserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Токен отсутствует, недействителен или истёк' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@CurrentUser() user: JwtRequestUser): Promise<PublicAuthUser> {
    return this.getCurrentUserUseCase.execute(user.id);
  }
}
