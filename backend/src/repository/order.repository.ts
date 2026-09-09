import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { OrderEntity } from '../order/entities/order.entity';
import { ITicket } from '../common/interfaces/ticket.interface';

export interface Order {
  id: string;
  email: string;
  phone: string;
  tickets: ITicket[];
  createdAt: Date;
}

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepo: Repository<OrderEntity>,
  ) {}

  async create(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const order = this.orderRepo.create({
      id: uuidv4(),
      email: orderData.email,
      phone: orderData.phone,
      tickets: orderData.tickets,
      createdAt: new Date(),
    });
    await this.orderRepo.save(order);
    return this.toOrder(order);
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.orderRepo.find();
    return orders.map(this.toOrder);
  }

  async findById(id: string): Promise<Order | undefined> {
    const order = await this.orderRepo.findOne({ where: { id } });
    return order ? this.toOrder(order) : undefined;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.orderRepo.delete(id);
    return (result.affected || 0) > 0;
  }

  private toOrder(entity: OrderEntity): Order {
    return {
      id: entity.id,
      email: entity.email,
      phone: entity.phone,
      tickets: entity.tickets,
      createdAt: entity.createdAt,
    };
  }
}
