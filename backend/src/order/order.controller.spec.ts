jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => {},
  getRepositoryToken: () => 'MOCK_REPOSITORY',
}));

jest.mock('uuid', () => ({
  v4: () => 'mock-uuid-' + Math.random().toString(36).substring(2, 10),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: jest.Mocked<OrderService>;

  const mockCreateOrderDto: CreateOrderDto = {
    email: 'test@test.ru',
    phone: '+7 (900) 123-45-67',
    tickets: [
      {
        film: 'film-1',
        session: 'session-1',
        daytime: '2024-06-28T10:00:53+03:00',
        row: 1,
        seat: 1,
        price: 350,
      },
    ],
  };

  const mockOrderResponse: OrderResponseDto = {
    total: 1,
    items: [
      {
        id: 'order-1',
        film: 'film-1',
        session: 'session-1',
        daytime: '2024-06-28T10:00:53+03:00',
        row: 1,
        seat: 1,
        price: 350,
      },
    ],
  };

  beforeEach(async () => {
    const mockOrderService = {
      createOrder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('должен создать заказ и вернуть результат', async () => {
      orderService.createOrder.mockResolvedValue(mockOrderResponse);

      const result = await controller.createOrder(mockCreateOrderDto);

      expect(result).toEqual(mockOrderResponse);
      expect(orderService.createOrder).toHaveBeenCalledWith(mockCreateOrderDto);
      expect(orderService.createOrder).toHaveBeenCalledTimes(1);
    });

    it('должен пробросить BadRequestException из сервиса', async () => {
      orderService.createOrder.mockRejectedValue(
        new BadRequestException('Место 1:1 уже занято'),
      );

      await expect(controller.createOrder(mockCreateOrderDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(orderService.createOrder).toHaveBeenCalledWith(mockCreateOrderDto);
    });
  });
});