import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@shared/infrastructure/prisma';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true, // включает кэширование значений
      envFilePath: '.env',
      expandVariables: true, // разрешает использовать одни переменные окружения внутри других.
      isGlobal: true,
    }),
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
