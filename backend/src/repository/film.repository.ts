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

  // Метод для добавления занятого места
  async addTakenSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<void> {
    await this.filmModel
      .updateOne(
        {
          id: filmId,
          'schedule.id': sessionId,
        },
        {
          $addToSet: { 'schedule.$.taken': seatKey },
        },
      )
      .exec();
  }
}
