import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(configService: ConfigService) {
    const user = encodeURIComponent(configService.getOrThrow<string>('DATABASE_USER'));
    const password = encodeURIComponent(configService.getOrThrow<string>('DATABASE_PASSWORD'));
    const host = configService.getOrThrow<string>('DATABASE_HOST');
    const port = configService.getOrThrow<string>('DATABASE_PORT');
    const database = configService.getOrThrow<string>('DATABASE_NAME');
    const schema = encodeURIComponent(configService.getOrThrow<string>('DATABASE_SCHEMA'));
    const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}?schema=${schema}`;

    super({
      adapter: new PrismaPg({ connectionString }),
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
