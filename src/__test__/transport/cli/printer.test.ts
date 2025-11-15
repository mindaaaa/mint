import {
  printSuccess,
  printError,
  printUsage,
} from '@app/transport/cli/printer.js';
import { MintError } from '@app/run/errors.js';
import { logger } from '@app/utils/logger.js';

jest.mock('@app/utils/logger.js', () => ({
  logger: {
    success: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    plain: jest.fn(),
  },
}));

describe('CLI printer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('printSuccess', () => {
    test('성공 메시지를 출력한다', () => {
      // Given
      const stdout = ['hello', 'world'];

      // When
      printSuccess(stdout);

      // Then
      expect(logger.success).toHaveBeenCalledTimes(1);
      expect(logger.success).toHaveBeenCalledWith('🌿 Result');
      expect(logger.plain).toHaveBeenCalledTimes(2);
      expect(logger.plain).toHaveBeenNthCalledWith(1, '  hello');
      expect(logger.plain).toHaveBeenNthCalledWith(2, '  world');
    });

    test('출력이 없으면 기본 메시지를 출력한다', () => {
      // Given
      const stdout: string[] = [];

      // When
      printSuccess(stdout);

      // Then
      expect(logger.success).toHaveBeenCalledWith('🌿 Result');
      expect(logger.plain).toHaveBeenCalledTimes(1);
      expect(logger.plain).toHaveBeenCalledWith('  (no output)');
    });

    test('단일 출력을 출력한다', () => {
      // Given
      const stdout = ['single line'];

      // When
      printSuccess(stdout);

      // Then
      expect(logger.success).toHaveBeenCalledWith('🌿 Result');
      expect(logger.plain).toHaveBeenCalledTimes(1);
      expect(logger.plain).toHaveBeenCalledWith('  single line');
    });
  });

  describe('printError', () => {
    test('에러 메시지를 출력한다', () => {
      // Given
      const error = new MintError({
        origin: 'LEXER',
        message: 'Unexpected character',
        location: {
          file: 'test.mint',
          position: { line: 1, column: 1 },
        },
      });

      // When
      printError(error);

      // Then
      expect(logger.error).toHaveBeenCalled();
      // headline이 출력되었는지 확인
      const errorCalls = (logger.error as jest.Mock).mock.calls;
      expect(errorCalls.some((call) => call[0].includes('Lexer Error'))).toBe(
        true
      );
    });

    test('hint가 있으면 hint를 출력한다', () => {
      // Given
      const error = new MintError({
        origin: 'LEXER',
        message: 'Unexpected character',
        hint: 'Check the syntax',
      });

      // When
      printError(error);

      // Then
      expect(logger.warn).toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Check the syntax')
      );
    });

    test('hint가 없으면 hint를 출력하지 않는다', () => {
      // Given
      const error = new MintError({
        origin: 'LEXER',
        message: 'Unexpected character',
      });

      // When
      printError(error);

      // Then
      expect(logger.warn).not.toHaveBeenCalled();
    });

    test('다양한 에러 타입을 출력한다', () => {
      // Given
      const lexerError = new MintError({
        origin: 'LEXER',
        message: 'Lexer error',
      });
      const parserError = new MintError({
        origin: 'PARSER',
        message: 'Parser error',
      });
      const evaluatorError = new MintError({
        origin: 'EVALUATOR',
        message: 'Runtime error',
      });

      // When
      printError(lexerError);
      printError(parserError);
      printError(evaluatorError);

      // Then
      expect(logger.error).toHaveBeenCalledTimes(6); // headline + details 각각
      const errorCalls = (logger.error as jest.Mock).mock.calls;
      expect(errorCalls.some((call) => call[0].includes('Lexer Error'))).toBe(
        true
      );
      expect(errorCalls.some((call) => call[0].includes('Parser Error'))).toBe(
        true
      );
      expect(errorCalls.some((call) => call[0].includes('Runtime Error'))).toBe(
        true
      );
    });
  });

  describe('printUsage', () => {
    test('사용법을 출력한다', () => {
      // When
      printUsage();

      // Then
      expect(logger.info).toHaveBeenCalledTimes(1);
      expect(logger.info).toHaveBeenCalledWith(
        'Usage: mint <command> [options]'
      );
      expect(logger.plain).toHaveBeenCalledTimes(2);
      expect(logger.plain).toHaveBeenNthCalledWith(
        1,
        '  run <file>     지정된 .mint 파일을 실행합니다.'
      );
      expect(logger.plain).toHaveBeenNthCalledWith(
        2,
        '  version        CLI 버전을 출력합니다.'
      );
    });
  });
});
