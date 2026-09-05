import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmListResponseDto, ScheduleResponseDto } from './dto/films.dto';

@Controller()
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get('films')
  async getFilms(): Promise<FilmListResponseDto> {
    return await this.filmsService.getFilms();
  }

  @Get('films/:id/schedule')
  async getFilmSchedule(@Param('id') id: string): Promise<ScheduleResponseDto> {
    return await this.filmsService.getFilmSchedule(id);
  }
}
