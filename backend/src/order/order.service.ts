import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';
import { OrderRepository } from '../repository/order.repository';
import { FilmRepository } from '../repository/film.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly filmRepository: FilmRepository,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    const { tickets } = createOrderDto;

    // Проверка на дубликаты внутри одного заказа
    const uniqueTickets = new Set<string>();
    for (const ticket of tickets) {
      const key = `${ticket.film}|${ticket.session}|${ticket.row}|${ticket.seat}`;
      if (uniqueTickets.has(key)) {
        throw new BadRequestException(
          `Билет на место ${ticket.row}:${ticket.seat} указан дважды в одном заказе`,
        );
      }
      uniqueTickets.add(key);
    }

    // Проверяем каждое место
    for (const ticket of tickets) {
      const film = await this.filmRepository.findById(ticket.film);
      if (!film) {
        throw new BadRequestException(`Фильм с id ${ticket.film} не найден`);
      }

      const session = film.schedule?.find((s) => s.id === ticket.session);
      if (!session) {
        throw new BadRequestException(`Сеанс с id ${ticket.session} не найден`);
      }

      const seatKey = `${ticket.row}:${ticket.seat}`;
      if (session.taken?.includes(seatKey)) {
        throw new BadRequestException(
          `Место ${ticket.row}:${ticket.seat} уже занято на сеансе ${ticket.session}`,
        );
      }

      if (ticket.row > session.rows || ticket.seat > session.seats) {
        throw new BadRequestException(
          `Место ${ticket.row}:${ticket.seat} не существует в зале (рядов: ${session.rows}, мест: ${session.seats})`,
        );
      }
    }

    // Создаём заказ
    const order = await this.orderRepository.create(createOrderDto);

    // ✅ Атомарно обновляем занятые места
    for (const ticket of tickets) {
      const success = await this.filmRepository.addTakenSeat(
        ticket.film,
        ticket.session,
        `${ticket.row}:${ticket.seat}`,
      );

      if (!success) {
        // Откат: удаляем заказ, т.к. место занято
        await this.orderRepository.delete(order.id);
        throw new BadRequestException(
          `Место ${ticket.row}:${ticket.seat} уже занято на сеансе ${ticket.session}`,
        );
      }
    }

    return {
      total: order.tickets.length,
      items: order.tickets.map((ticket) => ({
        id: order.id,
        film: ticket.film,
        session: ticket.session,
        daytime: ticket.daytime,
        row: ticket.row,
        seat: ticket.seat,
        price: ticket.price,
      })),
    };
  }
}
