import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface Ticket {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export interface Order {
  id: string;
  email: string;
  phone: string;
  tickets: Ticket[];
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
