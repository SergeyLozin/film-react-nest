// Ответ на GET /api/afisha/films
export class FilmResponseDto {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
}

export class FilmListResponseDto {
  total: number;
  items: FilmResponseDto[];
}

// Ответ на GET /api/afisha/films/:id/schedule
export class ScheduleItemDto {
  id: string;
  daytime: string;
  hall: string;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export class ScheduleResponseDto {
  total: number;
  items: ScheduleItemDto[];
}
