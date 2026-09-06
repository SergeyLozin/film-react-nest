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

  get port(): number {
    return parseInt(this.configService.get<string>('PORT') || '3001', 10);
  }

  get debug(): string {
    return this.configService.get<string>('DEBUG') || '';
  }

  get databaseDriver(): string {
    return this.configService.get<string>('DATABASE_DRIVER') || 'mongodb';
  }
}
