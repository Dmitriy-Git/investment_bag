import { Module, Global } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { TInvestModule } from "./t-invest/t-invest.module";
import { PrismaService } from "./common/prisma.service";
import { HttpErrorHandlerService } from "./common/http-error-handler.service";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // делает ConfigModule глобальным, доступным во всех модулях
      envFilePath: ".env", // путь к файлу .env
    }),
    UserModule,
    TInvestModule,
  ],
  providers: [PrismaService, HttpErrorHandlerService],
  exports: [PrismaService, HttpErrorHandlerService],
})
export class AppModule {}
