import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Данные для входа пользователя
 */
export class LoginDto {
  @IsEmail({}, { message: 'email must be a valid email address' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
