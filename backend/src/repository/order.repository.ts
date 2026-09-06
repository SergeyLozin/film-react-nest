import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
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
  private orders: Order[] = [];

  async create(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const order: Order = {
      id: uuidv4(),
      ...orderData,
      createdAt: new Date(),
    };
    this.orders.push(order);
    return order;
  }

  async findAll(): Promise<Order[]> {
    return this.orders;
  }

  async findById(id: string): Promise<Order | undefined> {
    return this.orders.find((order) => order.id === id);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.orders.findIndex((order) => order.id === id);
    if (index === -1) return false;
    this.orders.splice(index, 1);
    return true;
  }

  isSeatTaken(sessionId: string, row: number, seat: number): boolean {
    return this.orders.some((order) =>
      order.tickets.some(
        (ticket) =>
          ticket.session === sessionId &&
          ticket.row === row &&
          ticket.seat === seat,
      ),
    );
  }

  async clear(): Promise<void> {
    this.orders = [];
  }
}
