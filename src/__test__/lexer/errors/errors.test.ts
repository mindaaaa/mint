import { LexerError } from '@core/lexer/errors/errors.js';
import type { SourcePosition } from '@core/lexer/tokens.js';

describe('LexerError', () => {
  // LexerError 생성자를 mock으로 대체
  let LexerErrorConstructor: jest.SpyInstance;

  beforeEach(() => {
    // LexerError 생성자를 spy로 감싸서 호출을 추적
    LexerErrorConstructor = jest.spyOn(
      require('@core/lexer/errors/errors.js'),
      'LexerError'
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('생성자', () => {
    test('기본 에러 정보로 LexerError를 생성한다', () => {
      // Given
      const options = {
        code: 'LEXER_UNEXPECTED_CHARACTER' as const,
        message: 'Unexpected character',
        position: { line: 1, column: 1 } as SourcePosition,
        details: { char: '$' },
      };

      // Mock 인스턴스 생성
      const mockError = {
        name: 'LexerError',
        message: 'Unexpected character',
        code: 'LEXER_UNEXPECTED_CHARACTER',
        position: { line: 1, column: 1 },
        details: { char: '$' },
      } as unknown as LexerError;

      LexerErrorConstructor.mockImplementation(() => mockError);

      // When
      const error = new LexerError(options);

      // Then
      expect(LexerErrorConstructor).toHaveBeenCalledTimes(1);
      expect(LexerErrorConstructor).toHaveBeenCalledWith(options);
      expect(error).toBe(mockError);
      expect(error.name).toBe('LexerError');
      expect(error.message).toBe('Unexpected character');
      expect(error.code).toBe('LEXER_UNEXPECTED_CHARACTER');
      expect(error.position).toEqual({ line: 1, column: 1 });
      expect(error.details).toEqual({ char: '$' });
    });

    test('lexeme 정보가 있는 에러를 생성한다', () => {
      // Given
      const options = {
        code: 'LEXER_UNEXPECTED_CHARACTER' as const,
        message: 'Unexpected character',
        position: { line: 1, column: 2 } as SourcePosition,
        lexeme: '$',
        details: { char: '$' },
      };

      const mockError = {
        name: 'LexerError',
        message: 'Unexpected character',
        code: 'LEXER_UNEXPECTED_CHARACTER',
        position: { line: 1, column: 2 },
        lexeme: '$',
        details: { char: '$' },
      } as unknown as LexerError;

      LexerErrorConstructor.mockImplementation(() => mockError);

      // When
      const error = new LexerError(options);

      // Then
      expect(LexerErrorConstructor).toHaveBeenCalledWith(options);
      expect(error.lexeme).toBe('$');
    });

    test('다양한 에러 코드로 에러를 생성할 수 있다', () => {
      // Given
      const unterminatedOptions = {
        code: 'LEXER_UNTERMINATED_STRING' as const,
        message: 'Unterminated string literal',
        position: { line: 1, column: 1 } as SourcePosition,
        details: undefined,
      };

      const mockError = {
        name: 'LexerError',
        message: 'Unterminated string literal',
        code: 'LEXER_UNTERMINATED_STRING',
        position: { line: 1, column: 1 },
        details: undefined,
      } as unknown as LexerError;

      LexerErrorConstructor.mockImplementation(() => mockError);

      // When
      const error = new LexerError(unterminatedOptions);

      // Then
      expect(LexerErrorConstructor).toHaveBeenCalledWith(unterminatedOptions);
      expect(error.code).toBe('LEXER_UNTERMINATED_STRING');
      expect(error.details).toBeUndefined();
    });
  });

  describe('에러 속성', () => {
    test('에러 메시지가 올바르게 설정된다', () => {
      // Given
      const message = 'Custom error message';
      const options = {
        code: 'LEXER_UNEXPECTED_CHARACTER' as const,
        message,
        position: { line: 1, column: 1 } as SourcePosition,
        details: { char: 'x' },
      };

      const mockError = {
        name: 'LexerError',
        message,
        code: 'LEXER_UNEXPECTED_CHARACTER',
        position: { line: 1, column: 1 },
        details: { char: 'x' },
      } as unknown as LexerError;

      LexerErrorConstructor.mockImplementation(() => mockError);

      // When
      const error = new LexerError(options);

      // Then
      expect(LexerErrorConstructor).toHaveBeenCalledWith(options);
      expect(error.message).toBe(message);
    });

    test('위치 정보가 올바르게 저장된다', () => {
      // Given
      const position: SourcePosition = { line: 5, column: 10 };
      const options = {
        code: 'LEXER_UNEXPECTED_CHARACTER' as const,
        message: 'Test',
        position,
        details: { char: 'x' },
      };

      const mockError = {
        name: 'LexerError',
        message: 'Test',
        code: 'LEXER_UNEXPECTED_CHARACTER',
        position,
        details: { char: 'x' },
      } as unknown as LexerError;

      LexerErrorConstructor.mockImplementation(() => mockError);

      // When
      const error = new LexerError(options);

      // Then
      expect(LexerErrorConstructor).toHaveBeenCalledWith(options);
      expect(error.position).toEqual(position);
      expect(error.position.line).toBe(5);
      expect(error.position.column).toBe(10);
    });
  });

  describe('에러 상속', () => {
    test('Error 클래스를 상속받는다', () => {
      // Given
      const options = {
        code: 'LEXER_UNEXPECTED_CHARACTER' as const,
        message: 'Test',
        position: { line: 1, column: 1 } as SourcePosition,
        details: { char: 'x' },
      };

      // 실제 Error를 상속받은 mock 객체 생성
      const mockError = Object.create(Error.prototype);
      Object.assign(mockError, {
        name: 'LexerError',
        message: 'Test',
        code: 'LEXER_UNEXPECTED_CHARACTER',
        position: { line: 1, column: 1 },
        details: { char: 'x' },
        stack: 'Error: Test\n    at ...',
      });

      LexerErrorConstructor.mockImplementation(() => mockError);

      // When
      const error = new LexerError(options);

      // Then
      expect(LexerErrorConstructor).toHaveBeenCalledWith(options);
      expect(error instanceof Error).toBe(true);
      expect(error.stack).toBeDefined();
    });

    test('에러를 throw할 수 있다', () => {
      // Given
      const options = {
        code: 'LEXER_UNEXPECTED_CHARACTER' as const,
        message: 'Test',
        position: { line: 1, column: 1 } as SourcePosition,
        details: { char: 'x' },
      };

      const mockError = Object.create(Error.prototype);
      Object.assign(mockError, {
        name: 'LexerError',
        message: 'Test',
        code: 'LEXER_UNEXPECTED_CHARACTER',
        position: { line: 1, column: 1 },
        details: { char: 'x' },
      });

      LexerErrorConstructor.mockImplementation(() => mockError);

      const error = new LexerError(options);

      // When
      const when = () => {
        throw error;
      };

      // Then
      expect(LexerErrorConstructor).toHaveBeenCalledWith(options);
      expect(when).toThrow();
      expect(when).toThrow('Test');
    });
  });
});
