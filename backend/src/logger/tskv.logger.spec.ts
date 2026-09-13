import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let stdoutSpy: jest.SpyInstance;
  let stderrSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * Вспомогательная функция: парсит TSKV-строку в объект.
   */
  const parseTskv = (line: string): Record<string, string> => {
    const result: Record<string, string> = {};
    const trimmed = line.replace(/\n$/, '');
    trimmed.split('\t').forEach((field) => {
      const [key, ...rest] = field.split('=');
      result[key] = rest.join('=');
    });
    return result;
  };

  describe('log', () => {
    it('должен выводить лог в формате TSKV с уровнем log', () => {
      logger.log('test message');

      expect(stdoutSpy).toHaveBeenCalledTimes(1);
      const output = stdoutSpy.mock.calls[0][0] as string;
      const parsed = parseTskv(output);

      expect(parsed.level).toBe('log');
      expect(parsed.message).toBe('test message');
      expect(parsed.timestamp).toBeDefined();
    });

    it('должен заканчиваться символом переноса строки', () => {
      logger.log('test message');

      const output = stdoutSpy.mock.calls[0][0] as string;
      expect(output.endsWith('\n')).toBe(true);
    });

    it('должен разделять поля символом табуляции', () => {
      logger.log('test message');

      const output = stdoutSpy.mock.calls[0][0] as string;
      const trimmed = output.replace(/\n$/, '');
      const fields = trimmed.split('\t');

      expect(fields.length).toBeGreaterThanOrEqual(3);
    });

    it('должен включать дополнительные параметры', () => {
      logger.log('test message', 'param1');

      const output = stdoutSpy.mock.calls[0][0] as string;
      const parsed = parseTskv(output);

      expect(parsed.optionalParams).toBeDefined();
      expect(parsed.optionalParams).toContain('param1');
    });

    it('должен убирать табы и переносы из сообщения', () => {
      logger.log('message\twith\ttabs\nand\nnewlines');

      const output = stdoutSpy.mock.calls[0][0] as string;
      const parsed = parseTskv(output);

      expect(parsed.message).not.toContain('\t');
      expect(parsed.message).not.toContain('\n');
    });
  });

  describe('error', () => {
    it('должен выводить лог в формате TSKV с уровнем error в stderr', () => {
      logger.error('error message');

      expect(stderrSpy).toHaveBeenCalledTimes(1);
      const output = stderrSpy.mock.calls[0][0] as string;
      const parsed = parseTskv(output);

      expect(parsed.level).toBe('error');
      expect(parsed.message).toBe('error message');
    });
  });

  describe('warn', () => {
    it('должен выводить лог в формате TSKV с уровнем warn в stderr', () => {
      logger.warn('warn message');

      expect(stderrSpy).toHaveBeenCalledTimes(1);
      const output = stderrSpy.mock.calls[0][0] as string;
      const parsed = parseTskv(output);

      expect(parsed.level).toBe('warn');
      expect(parsed.message).toBe('warn message');
    });
  });

  describe('debug', () => {
    it('должен выводить лог в формате TSKV с уровнем debug', () => {
      logger.debug('debug message');

      expect(stdoutSpy).toHaveBeenCalledTimes(1);
      const output = stdoutSpy.mock.calls[0][0] as string;
      const parsed = parseTskv(output);

      expect(parsed.level).toBe('debug');
      expect(parsed.message).toBe('debug message');
    });
  });

  describe('verbose', () => {
    it('должен выводить лог в формате TSKV с уровнем verbose', () => {
      logger.verbose('verbose message');

      expect(stdoutSpy).toHaveBeenCalledTimes(1);
      const output = stdoutSpy.mock.calls[0][0] as string;
      const parsed = parseTskv(output);

      expect(parsed.level).toBe('verbose');
      expect(parsed.message).toBe('verbose message');
    });
  });
});