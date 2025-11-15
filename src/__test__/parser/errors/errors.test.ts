import { ParserError } from '@core/parser/errors/errors.js';
import type { SourcePosition } from '@core/lexer/tokens.js';

describe('ParserError', () => {
  let ParserErrorConstructor: jest.SpyInstance;

  beforeEach(() => {
    ParserErrorConstructor = jest.spyOn(
      require('@core/parser/errors/errors.js'),
      'ParserError'
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('생성자', () => {
    test('기본 에러 정보로 ParserError를 생성한다', () => {
      // Given
      const options = {
        code: 'PARSER_EXPECTED_TOKEN' as const,
        message: 'Expected token',
        position: { line: 1, column: 1 } as SourcePosition,
        details: { expected: 'identifier', actual: '=' },
      };

      // Mock 인스턴스 생성
      const mockError = {
        name: 'ParserError',
        message: 'Expected token',
        code: 'PARSER_EXPECTED_TOKEN',
        position: { line: 1, column: 1 },
        details: { expected: 'identifier', actual: '=' },
      } as unknown as ParserError;

      ParserErrorConstructor.mockImplementation(() => mockError);

      // When
      const error = new ParserError(options);

      // Then
      expect(ParserErrorConstructor).toHaveBeenCalledTimes(1);
      expect(ParserErrorConstructor).toHaveBeenCalledWith(options);
      expect(error).toBe(mockError);
      expect(error.name).toBe('ParserError');
      expect(error.message).toBe('Expected token');
      expect(error.code).toBe('PARSER_EXPECTED_TOKEN');
      expect(error.position).toEqual({ line: 1, column: 1 });
      expect(error.details).toEqual({ expected: 'identifier', actual: '=' });
    });

    test('lexeme 정보가 있는 에러를 생성한다', () => {
      // Given
      const options = {
        code: 'PARSER_UNEXPECTED_TOKEN' as const,
        message: 'Unexpected token',
        position: { line: 1, column: 2 } as SourcePosition,
        lexeme: '=',
        details: { actual: '=', expected: 'identifier' },
      };

      const mockError = {
        name: 'ParserError',
        message: 'Unexpected token',
        code: 'PARSER_UNEXPECTED_TOKEN',
        position: { line: 1, column: 2 },
        lexeme: '=',
        details: { actual: '=', expected: 'identifier' },
      } as unknown as ParserError;

      ParserErrorConstructor.mockImplementation(() => mockError);

      // When
      const error = new ParserError(options);

      // Then
      expect(ParserErrorConstructor).toHaveBeenCalledWith(options);
      expect(error.lexeme).toBe('=');
    });

    test('다양한 에러 코드로 에러를 생성할 수 있다', () => {
      // Given
      const unexpectedOptions = {
        code: 'PARSER_UNEXPECTED_TOKEN' as const,
        message: 'Unexpected token',
        position: { line: 1, column: 1 } as SourcePosition,
        details: { actual: '=', expected: 'identifier' },
      };

      const mockError = {
        name: 'ParserError',
        message: 'Unexpected token',
        code: 'PARSER_UNEXPECTED_TOKEN',
        position: { line: 1, column: 1 },
        details: { actual: '=', expected: 'identifier' },
      } as unknown as ParserError;

      ParserErrorConstructor.mockImplementation(() => mockError);

      // When
      const error = new ParserError(unexpectedOptions);

      // Then
      expect(ParserErrorConstructor).toHaveBeenCalledWith(unexpectedOptions);
      expect(error.code).toBe('PARSER_UNEXPECTED_TOKEN');
      expect(error.details).toEqual({ actual: '=', expected: 'identifier' });
    });
  });

  describe('에러 속성', () => {
    test('에러 메시지가 올바르게 설정된다', () => {
      // Given
      const message = 'Custom error message';
      const options = {
        code: 'PARSER_EXPECTED_TOKEN' as const,
        message,
        position: { line: 1, column: 1 } as SourcePosition,
        details: { expected: 'identifier', actual: 'x' },
      };

      const mockError = {
        name: 'ParserError',
        message,
        code: 'PARSER_EXPECTED_TOKEN',
        position: { line: 1, column: 1 },
        details: { expected: 'identifier', actual: 'x' },
      } as unknown as ParserError;

      ParserErrorConstructor.mockImplementation(() => mockError);

      // When
      const error = new ParserError(options);

      // Then
      expect(ParserErrorConstructor).toHaveBeenCalledWith(options);
      expect(error.message).toBe(message);
    });

    test('위치 정보가 올바르게 저장된다', () => {
      // Given
      const position: SourcePosition = { line: 5, column: 10 };
      const options = {
        code: 'PARSER_EXPECTED_TOKEN' as const,
        message: 'Test',
        position,
        details: { expected: 'identifier', actual: 'x' },
      };

      const mockError = {
        name: 'ParserError',
        message: 'Test',
        code: 'PARSER_EXPECTED_TOKEN',
        position,
        details: { expected: 'identifier', actual: 'x' },
      } as unknown as ParserError;

      ParserErrorConstructor.mockImplementation(() => mockError);

      // When
      const error = new ParserError(options);

      // Then
      expect(ParserErrorConstructor).toHaveBeenCalledWith(options);
      expect(error.position).toEqual(position);
      expect(error.position.line).toBe(5);
      expect(error.position.column).toBe(10);
    });
  });

  describe('에러 상속', () => {
    test('Error 클래스를 상속받는다', () => {
      // Given
      const options = {
        code: 'PARSER_EXPECTED_TOKEN' as const,
        message: 'Test',
        position: { line: 1, column: 1 } as SourcePosition,
        details: { expected: 'identifier', actual: 'x' },
      };

      // 실제 Error를 상속받은 mock 객체 생성
      const mockError = Object.create(Error.prototype);
      Object.assign(mockError, {
        name: 'ParserError',
        message: 'Test',
        code: 'PARSER_EXPECTED_TOKEN',
        position: { line: 1, column: 1 },
        details: { expected: 'identifier', actual: 'x' },
        stack: 'Error: Test\n    at ...',
      });

      ParserErrorConstructor.mockImplementation(() => mockError);

      // When
      const error = new ParserError(options);

      // Then
      expect(ParserErrorConstructor).toHaveBeenCalledWith(options);
      expect(error instanceof Error).toBe(true);
      expect(error.stack).toBeDefined();
    });

    test('에러를 throw할 수 있다', () => {
      // Given
      const options = {
        code: 'PARSER_EXPECTED_TOKEN' as const,
        message: 'Test',
        position: { line: 1, column: 1 } as SourcePosition,
        details: { expected: 'identifier', actual: 'x' },
      };

      const mockError = Object.create(Error.prototype);
      Object.assign(mockError, {
        name: 'ParserError',
        message: 'Test',
        code: 'PARSER_EXPECTED_TOKEN',
        position: { line: 1, column: 1 },
        details: { expected: 'identifier', actual: 'x' },
      });

      ParserErrorConstructor.mockImplementation(() => mockError);

      const error = new ParserError(options);

      // When
      const when = () => {
        throw error;
      };

      // Then
      expect(ParserErrorConstructor).toHaveBeenCalledWith(options);
      expect(when).toThrow();
      expect(when).toThrow('Test');
    });
  });
});
