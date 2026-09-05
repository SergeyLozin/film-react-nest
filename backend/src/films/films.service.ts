import { Injectable } from '@nestjs/common';
import { FilmListResponseDto, ScheduleResponseDto } from './dto/films.dto';
import { FilmRepository } from '../repository/film.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmRepository: FilmRepository) {}

  async getFilms(): Promise<FilmListResponseDto> {
    const films = await this.filmRepository.findAll();
    return {
      total: films.length,
      items: films,
    };
  }

  async getFilmSchedule(id: string): Promise<ScheduleResponseDto> {
    const film = await this.filmRepository.findById(id);
    if (!film) {
      return { total: 0, items: [] };
    }
    return {
      total: film.schedule?.length || 0,
      items: film.schedule || [],
    };
  }
}
