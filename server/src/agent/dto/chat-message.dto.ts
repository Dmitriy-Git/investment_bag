import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class ChatMessageDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
