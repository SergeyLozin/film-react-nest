import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { RepositoryModule } from './repository/repository.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    // Подключение к MongoDB
    MongooseModule.forRoot(
      process.env.DATABASE_URL || 'mongodb://localhost:27017/film',
    ),
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
