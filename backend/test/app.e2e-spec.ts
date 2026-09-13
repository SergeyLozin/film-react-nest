jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => {},
  getRepositoryToken: (entity: any) =>
    typeof entity === 'function' ? `${entity.name}Repository` : 'Repository',
  TypeOrmModule: {
    forRoot: () => ({
      module: class MockTypeOrmModule {},
      providers: [],
      exports: [],
    }),
    forRootAsync: () => ({
      module: class MockTypeOrmModule {},
      providers: [],
      exports: [],
    }),
    forFeature: () => ({
      module: class MockTypeOrmFeatureModule {},
      providers: [],
      exports: [],
    }),
  },
}));

jest.mock('uuid', () => ({
  v4: () => 'mock-uuid-' + Math.random().toString(36).substring(2, 10),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { FilmRepository } from '../src/repository/film.repository';
import { OrderRepository } from '../src/repository/order.repository';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const mockFilmRepository = {
    findAll: jest.fn().mockResolvedValue([
      {
        id: 'test-film-1',
        rating: 8.5,
        director: 'Test Director',
        tags: ['Test'],
        title: 'Test Film',
        about: 'About',
        description: 'Description',
        image: '/bg1s.jpg',
        cover: '/bg1c.jpg',
        schedule: [],
      },
    ]),
    findById: jest.fn().mockResolvedValue(null),
    addTakenSeat: jest.fn().mockResolvedValue(true),
  };

  const mockOrderRepository = {
    create: jest.fn(),
    findAll: jest.fn().mockResolvedValue([]),
    findById: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FilmRepository)
      .useValue(mockFilmRepository)
      .overrideProvider(OrderRepository)
      .useValue(mockOrderRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/afisha');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/afisha/films', () => {
    it('должен вернуть список фильмов со статусом 200', () => {
      return request(app.getHttpServer())
        .get('/api/afisha/films')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('items');
          expect(Array.isArray(res.body.items)).toBe(true);
          expect(res.body.total).toBe(1);
        });
    });
  });

  describe('GET /api/afisha/films/:id/schedule', () => {
    it('должен вернуть 404 для несуществующего фильма', () => {
      return request(app.getHttpServer())
        .get('/api/afisha/films/00000000-0000-0000-0000-000000000000/schedule')
        .expect(404);
    });
  });
});
