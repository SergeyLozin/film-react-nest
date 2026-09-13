import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  /**
   * Форматирует сообщение в TSKV формат.
   * Поля разделяются табуляцией \t, запись заканчивается \n.
   */
  private formatMessage(
    level: string,
    message: any,
    ...optionalParams: any[]
  ): string {
    const fields: string[] = [
      `level=${level}`,
      `message=${this.stringify(message)}`,
      `timestamp=${new Date().toISOString()}`,
    ];

    if (optionalParams.length > 0) {
      fields.push(`optionalParams=${this.stringify(optionalParams)}`);
    }

    return fields.join('\t') + '\n';
  }

  /**
   * Приводит значение к строке, убирая лишние символы (табы, переносы),
   * чтобы не сломать формат TSKV.
   */
  private stringify(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    const str = typeof value === 'string' ? value : JSON.stringify(value);
    return str.replace(/[\t\n\r]/g, ' ');
  }

  log(message: any, ...optionalParams: any[]): void {
    process.stdout.write(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]): void {
    process.stderr.write(
      this.formatMessage('error', message, ...optionalParams),
    );
  }

  warn(message: any, ...optionalParams: any[]): void {
    process.stderr.write(
      this.formatMessage('warn', message, ...optionalParams),
    );
  }

  debug(message: any, ...optionalParams: any[]): void {
    process.stdout.write(
      this.formatMessage('debug', message, ...optionalParams),
    );
  }

  verbose(message: any, ...optionalParams: any[]): void {
    process.stdout.write(
      this.formatMessage('verbose', message, ...optionalParams),
    );
  }
}
