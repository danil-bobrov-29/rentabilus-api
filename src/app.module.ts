import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true, // включает кэширование значений
      envFilePath: '.env',
      expandVariables: true, // разрешает использовать одни переменные окружения внутри других.
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
