import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Глобальный префикс API
  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  // Получаем порт из ConfigService
  const configService = app.get(ConfigService);
  const port = configService.port;

  await app.listen(port);
  console.log(`🚀 Backend запущен на http://localhost:${port}`);
}
bootstrap();
