import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilmEntity } from '../films/entities/film.entity';
import { ScheduleEntity } from '../films/entities/schedule.entity';

export interface Film {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
  schedule?: Schedule[];
}

export interface Schedule {
  id: string;
  daytime: string;
  hall: string;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

@Injectable()
export class FilmRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private filmRepo: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private scheduleRepo: Repository<ScheduleEntity>,
  ) {}

  async findAll(): Promise<Film[]> {
    const films = await this.filmRepo.find({
      relations: ['schedule'],
    });
    return films.map(this.toFilm);
  }

  async findById(id: string): Promise<Film | null> {
    const film = await this.filmRepo.findOne({
      where: { id },
      relations: ['schedule'],
    });
    return film ? this.toFilm(film) : null;
  }

  async addTakenSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<boolean> {
    const result = await this.scheduleRepo
      .createQueryBuilder()
      .update(ScheduleEntity)
      .set({
        taken: () => 'array_append(taken, :seatKeyParam)',
      })
      .where('id = :sessionId', { sessionId })
      .andWhere('film_id = :filmId', { filmId })
      .andWhere('NOT (:seatKeyCheck = ANY(taken))', { seatKeyCheck: seatKey })
      .setParameter('seatKeyParam', seatKey)
      .execute();

    return (result.affected || 0) > 0;
  }

  private toFilm(entity: FilmEntity): Film {
    return {
      id: entity.id,
      rating: entity.rating,
      director: entity.director,
      tags: entity.tags,
      title: entity.title,
      about: entity.about,
      description: entity.description,
      image: entity.image,
      cover: entity.cover,
      schedule: entity.schedule?.map((s) => ({
        id: s.id,
        daytime: s.daytime.toISOString(),
        hall: s.hall,
        rows: s.rows,
        seats: s.seats,
        price: s.price,
        taken: s.taken || [],
      })),
    };
  }
}
