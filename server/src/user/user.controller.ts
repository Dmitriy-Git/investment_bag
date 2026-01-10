import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseFilters,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, Prisma } from '../generated/prisma/client.js';
import { AllExceptionsFilter } from '../common/all-exception.filter';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseFilters(AllExceptionsFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Создать нового пользователя
   * @param userData Данные пользователя (email обязательный, name опциональный)
   * @returns Созданный пользователь
   */
  @Post()
  async createUser(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.createUser(userData);
  }

  /**
   * Получить список пользователей
   * @param page Номер страницы (начинается с 1)
   * @param limit Количество элементов на странице
   * @param where Фильтрация - JSON строка с условиями поиска (например: '{"email": "user@example.com"}')
   * @param orderBy Сортировка - JSON строка с полем и направлением (например: '{"createdAt": "desc"}')
   * @returns Список пользователей
   */
  @Get()
  async getUsers(
    @Query(
      'page',
      new ParseIntPipe({ optional: true }),
      new DefaultValuePipe(1),
    )
    page?: number,
    @Query(
      'limit',
      new ParseIntPipe({ optional: true }),
      new DefaultValuePipe(10),
    )
    limit?: number,
    @Query('where') where?: string, // фильтрация - JSON строка с условиями поиска (например: '{"email": "user@example.com"}')
    @Query('orderBy') orderBy?: string, // сортировка - JSON строка с полем и направлением (например: '{"createdAt": "desc"}')
  ): Promise<User[]> {
    const params: {
      page?: number;
      limit?: number;
      where?: Prisma.UserWhereInput;
      orderBy?: Prisma.UserOrderByWithRelationInput;
    } = { page, limit };

    if (where) params.where = JSON.parse(where);
    if (orderBy) params.orderBy = JSON.parse(orderBy);

    return this.userService.users(params);
  }

  /**
   * Получить пользователя по ID
   * @param id ID пользователя
   * @returns Пользователь или null
   */
  @Get(':id')
  async getUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User | null> {
    return this.userService.user({ id });
  }

  /**
   * Обновить пользователя
   * @param id ID пользователя
   * @param userData Данные для обновления
   * @returns Обновленный пользователь
   */
  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser({
      where: { id },
      data: userData,
    });
  }

  /**
   * Удалить пользователя
   * @param id ID пользователя
   * @returns Удаленный пользователь
   */
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.deleteUser({ id });
  }
}

