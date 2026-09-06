import { ITicket } from '../../common/interfaces/ticket.interface';

// Запрос на POST /order
export class TicketDto implements ITicket {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export class CreateOrderDto {
  email: string;
  phone: string;
  tickets: TicketDto[];
}

// Ответ на POST /order
export class OrderResponseItemDto implements ITicket {
  id: string;
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export class OrderResponseDto {
  total: number;
  items: OrderResponseItemDto[];
}
