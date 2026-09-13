import { Injectable, ConsoleLogger } from '@nestjs/common';

@Injectable()
export class DevLogger extends ConsoleLogger {
  // Наследуем всё поведение ConsoleLogger
  // При необходимости можно переопределить методы
}