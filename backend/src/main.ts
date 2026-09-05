import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Глобальный префикс API
  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend запущен на http://localhost:${port}`);
}
bootstrap();
