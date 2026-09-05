import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from '../films/schemas/film.schema';
import { FilmRepository } from './film.repository';
import { OrderRepository } from './order.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  providers: [FilmRepository, OrderRepository],
  exports: [FilmRepository, OrderRepository],
})
export class RepositoryModule {}
