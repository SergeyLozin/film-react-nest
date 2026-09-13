import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('log', () => {
    it('должен выводить лог в формате JSON с уровнем log', () => {
      logger.log('test message');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed.level).toBe('log');
      expect(parsed.message).toBe('test message');
      expect(parsed.optionalParams).toEqual([]);
      expect(parsed.timestamp).toBeDefined();
    });

    it('должен включать дополнительные параметры в лог', () => {
      logger.log('test message', 'param1', 'param2');

      const output = consoleLogSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed.optionalParams).toEqual(['param1', 'param2']);
    });
  });

  describe('error', () => {
    it('должен выводить лог в формате JSON с уровнем error', () => {
      logger.error('error message');

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const output = consoleErrorSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed.level).toBe('error');
      expect(parsed.message).toBe('error message');
    });
  });

  describe('warn', () => {
    it('должен выводить лог в формате JSON с уровнем warn', () => {
      logger.warn('warn message');

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      const output = consoleWarnSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed.level).toBe('warn');
      expect(parsed.message).toBe('warn message');
    });
  });

  describe('debug', () => {
    it('должен выводить лог в формате JSON с уровнем debug', () => {
      logger.debug('debug message');

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      const output = consoleDebugSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed.level).toBe('debug');
      expect(parsed.message).toBe('debug message');
    });
  });

  describe('verbose', () => {
    it('должен выводить лог в формате JSON с уровнем verbose', () => {
      logger.verbose('verbose message');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed.level).toBe('verbose');
      expect(parsed.message).toBe('verbose message');
    });
  });
});