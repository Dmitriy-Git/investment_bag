import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, Prisma } from '../generated/prisma/client.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body() userData: { name?: string; email: string },
  ): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Get()
  async getUsers(
    @Query('skip') skip?: string, // offset - сколько записей пропустить (для пагинации: страница 2 при 10 на страницу = skip=10)
    @Query('take') take?: string, // limit - сколько записей взять (например, 10 записей на страницу)
    @Query('where') where?: string, // фильтрация - JSON строка с условиями поиска (например: '{"email": "user@example.com"}')
    @Query('orderBy') orderBy?: string, // сортировка - JSON строка с полем и направлением (например: '{"createdAt": "desc"}')
  ): Promise<User[]> {
    const params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.UserWhereUniqueInput;
      where?: Prisma.UserWhereInput;
      orderBy?: Prisma.UserOrderByWithRelationInput;
    } = {};

    if (skip) params.skip = parseInt(skip, 10);
    if (take) params.take = parseInt(take, 10);
    if (where) params.where = JSON.parse(where);
    if (orderBy) params.orderBy = JSON.parse(orderBy);

    return this.userService.users(params);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User | null> {
    return this.userService.user({ id: parseInt(id, 10) });
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.userService.updateUser({
      where: { id: parseInt(id, 10) },
      data: userData,
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.userService.deleteUser({ id: parseInt(id, 10) });
  }
}

