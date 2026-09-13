import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { ITicket } from '../../common/interfaces/ticket.interface';

@Entity('orders')
export class OrderEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 50 })
  phone: string;

  @Column('jsonb')
  tickets: ITicket[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
