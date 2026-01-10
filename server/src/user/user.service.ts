import { Injectable } from '@nestjs/common';
import { User, Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../common/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    page?: number;
    limit?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { page = 1, limit = 10, where, orderBy } = params;
    
    // Конвертируем page и limit в skip и take для Prisma
    const skip = (page - 1) * limit;
    const take = limit;

    return this.prisma.user.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  /**
   * Создать нового пользователя
   * @param data Данные пользователя
   * @returns Созданный пользователь
   */
  async createUser(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  /**
   * Обновить пользователя
   * @param params Параметры обновления (where, data)
   * @returns Обновленный пользователь
   */
  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: UpdateUserDto;
  }): Promise<User> {
    const { where, data } = params;
    
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}