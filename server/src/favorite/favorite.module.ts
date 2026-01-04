import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})

export class FavoriteModule {}

