import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmEntity } from '../films/entities/film.entity';
import { ScheduleEntity } from '../films/entities/schedule.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { FilmRepository } from './film.repository';
import { OrderRepository } from './order.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([FilmEntity, ScheduleEntity, OrderEntity]),
  ],
  providers: [FilmRepository, OrderRepository],
  exports: [FilmRepository, OrderRepository],
})
export class RepositoryModule {}
