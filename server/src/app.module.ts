import { Module, Global } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { FavoriteModule } from "./favorite/favorite.module";
import { TInvestModule } from "./t-invest/t-invest.module";
import { PortfolioModule } from "./portfolio/portfolio.module";
import { AgentModule } from "./agent/agent.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaService } from "./common/prisma.service";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    AuthModule,
    UserModule,
    FavoriteModule,
    TInvestModule,
    PortfolioModule,
    AgentModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})

export class AppModule {}
