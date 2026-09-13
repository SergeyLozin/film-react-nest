import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Глобальный префикс API
  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  // Получаем настройки из ConfigService
  const configService = app.get(ConfigService);
  const port = configService.port;

  // Выбираем логгер в зависимости от переменной окружения
  const loggerType = process.env.LOGGER_TYPE || 'dev';

  switch (loggerType) {
    case 'json':
      app.useLogger(new JsonLogger());
      break;
    case 'tskv':
      app.useLogger(new TskvLogger());
      break;
    case 'dev':
    default:
      app.useLogger(new DevLogger());
      break;
  }

  await app.listen(port);
}
bootstrap();