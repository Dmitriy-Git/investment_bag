import { Module, Global } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { FavoriteModule } from "./favorite/favorite.module";
import { TInvestModule } from "./t-invest/t-invest.module";
import { PrismaService } from "./common/prisma.service";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // делает ConfigModule глобальным, доступным во всех модулях
      envFilePath: ".env", // путь к файлу .env
    }),
    UserModule,
    FavoriteModule,
    TInvestModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})

export class AppModule {}
