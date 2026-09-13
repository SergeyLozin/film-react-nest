import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ScheduleEntity } from './schedule.entity';

@Entity('films')
export class FilmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('decimal', { precision: 3, scale: 1 })
  rating: number;

  @Column({ length: 255 })
  director: string;

  @Column('text', { array: true })
  tags: string[];

  @Column({ length: 255 })
  title: string;

  @Column('text')
  about: string;

  @Column('text')
  description: string;

  @Column({ length: 255 })
  image: string;

  @Column({ length: 255 })
  cover: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.film, {
    cascade: true,
  })
  schedule: ScheduleEntity[];
}
