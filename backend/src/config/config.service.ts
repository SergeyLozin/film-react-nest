import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get databaseDriver(): string {
    return this.configService.get<string>('DATABASE_DRIVER') || 'postgres';
  }

  get databaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST') || 'localhost';
  }

  get databasePort(): number {
    return parseInt(this.configService.get<string>('DATABASE_PORT') || '5432', 10);
  }

  get databaseName(): string {
    return this.configService.get<string>('DATABASE_NAME') || 'film';
  }

  get databaseUsername(): string {
    return this.configService.get<string>('DATABASE_USERNAME') || '';
  }

  get databasePassword(): string {
    return this.configService.get<string>('DATABASE_PASSWORD') || '';
  }

  get databaseUrl(): string {
    const username = this.databaseUsername;
    const password = this.databasePassword;
    const host = this.databaseHost;
    const port = this.databasePort;
    const name = this.databaseName;

    if (username && password) {
      return `postgresql://${username}:${password}@${host}:${port}/${name}`;
    }
    return `postgresql://${host}:${port}/${name}`;
  }

  get port(): number {
    return parseInt(this.configService.get<string>('PORT') || '3001', 10);
  }

  get debug(): boolean {
    return this.configService.get<string>('DEBUG') === '*';
  }
}