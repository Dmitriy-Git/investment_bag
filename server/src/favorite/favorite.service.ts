import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Favorite, Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../common/prisma.service';
import { UserService } from '../user/user.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  /**
   * Добавить инструмент в избранное пользователя
   * @param userId ID пользователя
   * @param data Данные избранного (instrumentId, instrumentType, notes)
   * @returns Созданная запись избранного
   */
  async addFavorite(
    userId: number,
    data: CreateFavoriteDto,
  ): Promise<Favorite> {
    // Проверяем существование пользователя
    const user = await this.userService.user({ id: userId });

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

