import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../films/schemas/film.schema';

@Injectable()
export class FilmRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async findAll(): Promise<Film[]> {
    return this.filmModel.find().exec();
  }

  async findById(id: string): Promise<Film | null> {
    return this.filmModel.findOne({ id }).exec();
  }

  /**
   * Атомарное добавление занятого места.
   * Проверяет, что место свободно, и только затем добавляет его.
   * Возвращает true, если место успешно забронировано, иначе false.
   */
  async addTakenSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<boolean> {
    const result = await this.filmModel
      .updateOne(
        {
          id: filmId,
          'schedule.id': sessionId,
          'schedule.taken': { $not: { $in: [seatKey] } }, // ✅ Место должно быть свободно
        },
        {
          $addToSet: { 'schedule.$.taken': seatKey },
        },
      )
      .exec();

    return result.modifiedCount > 0; // ✅ true, если бронирование успешно
  }
}
