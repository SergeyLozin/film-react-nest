jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => {},
  getRepositoryToken: () => 'MOCK_REPOSITORY',
}));

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmListResponseDto, ScheduleResponseDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: jest.Mocked<FilmsService>;

  const mockFilmsResponse: FilmListResponseDto = {
    total: 1,
    items: [
      {
        id: 'film-1',
        rating: 8.5,
        director: 'Test Director',
        tags: ['Test'],
        title: 'Test Film',
        about: 'About',
        description: 'Description',
        image: '/bg1s.jpg',
        cover: '/bg1c.jpg',
      },
    ],
  };

  const mockScheduleResponse: ScheduleResponseDto = {
    total: 1,
    items: [
      {
        id: 'session-1',
        daytime: '2024-06-28T10:00:53+03:00',
        hall: '1',
        rows: 5,
        seats: 10,
        price: 350,
        taken: [],
      },
    ],
  };

  beforeEach(async () => {
    const mockFilmsService = {
      getFilms: jest.fn(),
      getFilmSchedule: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    filmsService = module.get(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFilms', () => {
    it('должен вернуть список фильмов из сервиса', async () => {
      filmsService.getFilms.mockResolvedValue(mockFilmsResponse);

      const result = await controller.getFilms();

      expect(result).toEqual(mockFilmsResponse);
      expect(filmsService.getFilms).toHaveBeenCalledTimes(1);
    });

    it('должен вернуть пустой список, если фильмов нет', async () => {
      filmsService.getFilms.mockResolvedValue({ total: 0, items: [] });

      const result = await controller.getFilms();

      expect(result).toEqual({ total: 0, items: [] });
    });
  });

  describe('getFilmSchedule', () => {
    it('должен вернуть расписание фильма', async () => {
      filmsService.getFilmSchedule.mockResolvedValue(mockScheduleResponse);

      const result = await controller.getFilmSchedule('film-1');

      expect(result).toEqual(mockScheduleResponse);
      expect(filmsService.getFilmSchedule).toHaveBeenCalledWith('film-1');
      expect(filmsService.getFilmSchedule).toHaveBeenCalledTimes(1);
    });

    it('должен выбросить NotFoundException, если фильм не найден', async () => {
      filmsService.getFilmSchedule.mockRejectedValue(
        new NotFoundException('Фильм с id unknown не найден'),
      );

      await expect(controller.getFilmSchedule('unknown')).rejects.toThrow(
        NotFoundException,
      );
      expect(filmsService.getFilmSchedule).toHaveBeenCalledWith('unknown');
    });
  });
});
