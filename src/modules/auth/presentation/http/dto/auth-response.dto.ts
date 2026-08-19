import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthUserResponseDto {
  @ApiProperty({ format: 'uuid', example: '87991ff6-8d7a-4aa3-94ea-48d21d264176' })
  id!: string;

  @ApiProperty({ format: 'email', example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'Иван' })
  firstName!: string;

  @ApiProperty({ example: 'Иванов' })
  lastName!: string;

  @ApiPropertyOptional({ example: 'Иванович', nullable: true })
  middleName!: string | null;

  @ApiPropertyOptional({ example: 'Менеджер', nullable: true })
  position!: string | null;
}

export class AccessTokenResponseDto {
  @ApiProperty({
    description: 'JWT access-токен',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;
}

export class RegisterResponseDto extends AccessTokenResponseDto {
  @ApiProperty({ type: AuthUserResponseDto })
  user!: AuthUserResponseDto;
}
