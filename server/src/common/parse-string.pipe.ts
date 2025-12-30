import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';

/**
 * Pipe для валидации обязательного строкового параметра
 */
@Injectable()
export class ParseStringPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (
      value === undefined ||
      value === null ||
      typeof value !== 'string' ||
      value.trim() === ''
    ) {
      throw new BadRequestException(
        `Parameter ${metadata.data} is required and must be a non-empty string`,
      );
    }
    return value.trim();
  }
}

