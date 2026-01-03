import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { User, Prisma, Favorite } from '../generated/prisma/client.js';
import { PrismaService } from '../common/prisma.service';

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

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
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

  /**
   * Добавить инструмент в избранное пользователя
   * @param userId ID пользователя
   * @param data Данные избранного (instrumentId, instrumentType, notes)
   * @returns Созданная запись избранного
   */
  async addFavorite(
    userId: number,
    data: {
      instrumentId: string;
      instrumentType: string;
      notes?: string;
    },
  ): Promise<Favorite> {
    // Проверяем существование пользователя
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    try {
      // Создаем избранное (уникальность гарантируется @@unique([userId, instrumentId]))
      return await this.prisma.favorite.create({
        data: {
          userId,
          instrumentId: data.instrumentId,
          instrumentType: data.instrumentType,
          notes: data.notes,
        },
      });
    } catch (error) {
      // Обработка ошибки уникальности (P2002)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'This instrument is already in favorites',
        );
      }
      throw error;
    }
  }

  /**
   * Получить все избранное пользователя
   * @param userId ID пользователя
   * @returns Список избранных инструментов
   */
  async getFavorites(userId: number): Promise<Favorite[]> {
    return this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Удалить инструмент из избранного
   * @param userId ID пользователя
   * @param instrumentId ID инструмента
   * @returns Удаленная запись избранного
   */
  async removeFavorite(
    userId: number,
    instrumentId: string,
  ): Promise<Favorite> {
    const favorite = await this.prisma.favorite.findFirst({
      where: {
        userId,
        instrumentId,
      },
    });

    if (!favorite) {
      throw new NotFoundException(
        `Favorite with instrumentId ${instrumentId} not found for user ${userId}`,
      );
    }

    return this.prisma.favorite.delete({
      where: { id: favorite.id },
    });
  }
}