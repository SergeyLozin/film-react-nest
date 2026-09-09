import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get databaseUrl(): string {
    const url = this.configService.get<string>('DATABASE_URL');
    if (!url) {
      throw new Error('DATABASE_URL не задан в .env файле');
    }
    return url;
  }

  get databaseUsername(): string {
    return this.configService.get<string>('DATABASE_USERNAME') || '';
  }

  get databasePassword(): string {
    return this.configService.get<string>('DATABASE_PASSWORD') || '';
  }

  get databaseDriver(): string {
    return this.configService.get<string>('DATABASE_DRIVER') || 'postgres';
  }

  get port(): number {
    return parseInt(this.configService.get<string>('PORT') || '3001', 10);
  }

  get debug(): boolean {
    return this.configService.get<string>('DEBUG') === '*';
  }
}
