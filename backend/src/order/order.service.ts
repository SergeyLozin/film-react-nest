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

    // Проверяем каждое место
    for (const ticket of tickets) {
      // Находим фильм
      const film = await this.filmRepository.findById(ticket.film);
      if (!film) {
        throw new BadRequestException(`Фильм с id ${ticket.film} не найден`);
      }

      // Находим сеанс в расписании фильма
      const session = film.schedule?.find((s) => s.id === ticket.session);
      if (!session) {
        throw new BadRequestException(`Сеанс с id ${ticket.session} не найден`);
      }

      // Проверяем, не занято ли место
      const seatKey = `${ticket.row}:${ticket.seat}`;
      if (session.taken?.includes(seatKey)) {
        throw new BadRequestException(
          `Место ${ticket.row}:${ticket.seat} уже занято на сеансе ${ticket.session}`,
        );
      }

      // Проверяем, что место существует в зале
      if (ticket.row > session.rows || ticket.seat > session.seats) {
        throw new BadRequestException(
          `Место ${ticket.row}:${ticket.seat} не существует в зале (рядов: ${session.rows}, мест: ${session.seats})`,
        );
      }
    }

    // Создаём заказ
    const order = await this.orderRepository.create(createOrderDto);

    // Обновляем занятые места для каждого билета
    for (const ticket of tickets) {
      await this.filmRepository.addTakenSeat(
        ticket.film,
        ticket.session,
        `${ticket.row}:${ticket.seat}`,
      );
    }

    // Формируем ответ
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
