import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

/**
 * Данные для создания пользователя
 */
export class CreateUserDto {
  @IsEmail({}, { message: 'email must be a valid email address' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @IsString()
  @IsOptional()
  name?: string;
}

