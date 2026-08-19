import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ format: 'email', example: 'user@example.com' })
  @IsNotEmpty({ message: 'Email обязателен для заполнения' })
  @IsEmail({}, { message: 'Введите корректный email' })
  email!: string;

  @ApiProperty({ example: 'strong-password', minLength: 8, maxLength: 128 })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(8, { message: 'Пароль должен содержать не менее 8 символов' })
  @MaxLength(128, { message: 'Пароль должен содержать не более 128 символов' })
  password!: string;

  @ApiProperty({ example: 'Иван' })
  @IsNotEmpty({ message: 'Имя обязательно для заполнения' })
  @IsString({ message: 'Имя должно быть строкой' })
  firstName!: string;

  @ApiProperty({ example: 'Иванов' })
  @IsNotEmpty({ message: 'Фамилия обязательна для заполнения' })
  @IsString({ message: 'Фамилия должна быть строкой' })
  lastName!: string;

  @ApiPropertyOptional({ example: 'Иванович' })
  @IsOptional()
  @IsString({ message: 'Отчество должно быть строкой' })
  middleName?: string;
}
