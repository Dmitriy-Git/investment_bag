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

@Controller('users')
@UseFilters(AllExceptionsFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body() userData: { name?: string; email: string },
  ): Promise<User> {
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

  @Get(':id')
  async getUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User | null> {
    return this.userService.user({ id });
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.userService.updateUser({
      where: { id },
      data: userData,
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.deleteUser({ id });
  }
}

