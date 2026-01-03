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
  BadRequestException,
  DefaultValuePipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, Prisma, Favorite } from '../generated/prisma/client.js';
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

  /**
   * Добавить инструмент в избранное пользователя
   * @param id ID пользователя
   * @param body Данные избранного (instrumentId, instrumentType, notes?)
   * @returns Созданная запись избранного
   */
  @Post(':id/favorites')
  async addFavorite(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      instrumentId: string;
      instrumentType: string;
      notes?: string;
    },
  ): Promise<Favorite> {
    if (!body.instrumentId || !body.instrumentType) {
      throw new BadRequestException(
        'instrumentId and instrumentType are required',
      );
    }

    return this.userService.addFavorite(id, body);
  }

  /**
   * Получить все избранное пользователя
   * @param id ID пользователя
   * @returns Список избранных инструментов
   */
  @Get(':id/favorites')
  async getFavorites(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Favorite[]> {
    return this.userService.getFavorites(id);
  }

  /**
   * Удалить инструмент из избранного
   * @param id ID пользователя
   * @param instrumentId ID инструмента
   * @returns Удаленная запись избранного
   */
  @Delete(':id/favorites/:instrumentId')
  async removeFavorite(
    @Param('id', ParseIntPipe) id: number,
    @Param('instrumentId') instrumentId: string,
  ): Promise<Favorite> {
    return this.userService.removeFavorite(id, instrumentId);
  }
}

