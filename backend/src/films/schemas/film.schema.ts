import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FilmDocument = Film & Document;

@Schema({ collection: 'films' })
export class Film {
  @Prop({ required: true, type: String })
  id: string;

  @Prop({ required: true, type: Number })
  rating: number;

  @Prop({ required: true, type: String })
  director: string;

  @Prop({ required: true, type: [String] })
  tags: string[];

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  about: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: String })
  image: string;

  @Prop({ required: true, type: String })
  cover: string;

  @Prop({ type: Array, default: [] })
  schedule: ScheduleItem[];
}

@Schema()
export class ScheduleItem {
  @Prop({ required: true, type: String })
  id: string;

  @Prop({ required: true, type: String })
  daytime: string;

  @Prop({ required: true, type: String })
  hall: string;

  @Prop({ required: true, type: Number })
  rows: number;

  @Prop({ required: true, type: Number })
  seats: number;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ type: [String], default: [] })
  taken: string[];
}

export const FilmSchema = SchemaFactory.createForClass(Film);
