import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { RepositoryModule } from './repository/repository.module';

@Module({
  imports: [
    // ✅ Конфигурация
    ConfigModule,

    // ✅ Подключение к MongoDB через ConfigService
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.databaseUrl,
      }),
    }),

    // Раздача статического контента
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),

    FilmsModule,
    OrderModule,
    RepositoryModule,
  ],
})
export class AppModule {}
