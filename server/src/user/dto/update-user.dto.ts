import {
  IsString,
  IsEmail,
  IsOptional,
} from 'class-validator';

/**
 * Данные для обновления пользователя
 */
export class UpdateUserDto {
  @IsEmail({}, { message: 'email must be a valid email address' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;
}

