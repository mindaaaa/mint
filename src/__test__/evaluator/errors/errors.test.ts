import { EvaluatorError } from '@core/evaluator/errors/errors.js';

describe('EvaluatorError', () => {
  let EvaluatorErrorConstructor: jest.SpyInstance;

  beforeEach(() => {
    EvaluatorErrorConstructor = jest.spyOn(
      require('@core/evaluator/errors/errors.js'),
      'EvaluatorError'
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('생성자', () => {
    test('기본 에러 정보로 EvaluatorError를 생성한다', () => {
      // Given
      const options = {
        code: 'EVALUATOR_UNDEFINED_IDENTIFIER' as const,
        message: 'Undefined identifier',
        details: { name: 'x' },
      };

      // Mock 인스턴스 생성
      const mockError = {
        name: 'EvaluatorError',
        message: 'Undefined identifier',
        code: 'EVALUATOR_UNDEFINED_IDENTIFIER',
        details: { name: 'x' },
      } as unknown as EvaluatorError;

      EvaluatorErrorConstructor.mockImplementation(() => mockError);

      // When
      const error = new EvaluatorError(options);

      // Then
      expect(EvaluatorErrorConstructor).toHaveBeenCalledTimes(1);
      expect(EvaluatorErrorConstructor).toHaveBeenCalledWith(options);
      expect(error).toBe(mockError);
      expect(error.name).toBe('EvaluatorError');
      expect(error.message).toBe('Undefined identifier');
      expect(error.code).toBe('EVALUATOR_UNDEFINED_IDENTIFIER');
      expect(error.details).toEqual({ name: 'x' });
    });

    test('다양한 에러 코드로 에러를 생성할 수 있다', () => {
      // Given
      const typeErrorOptions = {
        code: 'EVALUATOR_TYPE_ERROR' as const,
        message: 'Type error',
        details: { operator: '+', operandTypes: ['number', 'string'] },
      };

      const mockError = {
        name: 'EvaluatorError',
        message: 'Type error',
        code: 'EVALUATOR_TYPE_ERROR',
        details: { operator: '+', operandTypes: ['number', 'string'] },
      } as unknown as EvaluatorError;

      EvaluatorErrorConstructor.mockImplementation(() => mockError);

      // When
      const error = new EvaluatorError(typeErrorOptions);

      // Then
      expect(EvaluatorErrorConstructor).toHaveBeenCalledWith(typeErrorOptions);
      expect(error.code).toBe('EVALUATOR_TYPE_ERROR');
      expect(error.details).toEqual({
        operator: '+',
        operandTypes: ['number', 'string'],
      });
    });

    test('details가 undefined인 에러를 생성할 수 있다', () => {
      // Given
      const returnErrorOptions = {
        code: 'EVALUATOR_RETURN_OUTSIDE_FUNCTION' as const,
        message: 'Return outside function',
        details: undefined,
      };

      const mockError = {
        name: 'EvaluatorError',
        message: 'Return outside function',
        code: 'EVALUATOR_RETURN_OUTSIDE_FUNCTION',
        details: undefined,
      } as unknown as EvaluatorError;

      EvaluatorErrorConstructor.mockImplementation(() => mockError);

      // When
      const error = new EvaluatorError(returnErrorOptions);

      // Then
      expect(EvaluatorErrorConstructor).toHaveBeenCalledWith(
        returnErrorOptions
      );
      expect(error.code).toBe('EVALUATOR_RETURN_OUTSIDE_FUNCTION');
      expect(error.details).toBeUndefined();
    });
  });

  describe('에러 속성', () => {
    test('에러 메시지가 올바르게 설정된다', () => {
      // Given
      const message = 'Custom error message';
      const options = {
        code: 'EVALUATOR_UNDEFINED_IDENTIFIER' as const,
        message,
        details: { name: 'x' },
      };

      const mockError = {
        name: 'EvaluatorError',
        message,
        code: 'EVALUATOR_UNDEFINED_IDENTIFIER',
        details: { name: 'x' },
      } as unknown as EvaluatorError;

      EvaluatorErrorConstructor.mockImplementation(() => mockError);

      // When
      const error = new EvaluatorError(options);

      // Then
      expect(EvaluatorErrorConstructor).toHaveBeenCalledWith(options);
      expect(error.message).toBe(message);
    });

    test('details 정보가 올바르게 저장된다', () => {
      // Given
      const details = { expected: 2, received: 3 };
      const options = {
        code: 'EVALUATOR_ARGUMENT_COUNT_MISMATCH' as const,
        message: 'Argument count mismatch',
        details,
      };

      const mockError = {
        name: 'EvaluatorError',
        message: 'Argument count mismatch',
        code: 'EVALUATOR_ARGUMENT_COUNT_MISMATCH',
        details,
      } as unknown as EvaluatorError;

      EvaluatorErrorConstructor.mockImplementation(() => mockError);

      // When
      const error = new EvaluatorError(options);

      // Then
      expect(EvaluatorErrorConstructor).toHaveBeenCalledWith(options);
      expect(error.details).toEqual(details);
      expect(error.details.expected).toBe(2);
      expect(error.details.received).toBe(3);
    });
  });

  describe('에러 상속', () => {
    test('Error 클래스를 상속받는다', () => {
      // Given
      const options = {
        code: 'EVALUATOR_UNDEFINED_IDENTIFIER' as const,
        message: 'Test',
        details: { name: 'x' },
      };

      // 실제 Error를 상속받은 mock 객체 생성
      const mockError = Object.create(Error.prototype);
      Object.assign(mockError, {
        name: 'EvaluatorError',
        message: 'Test',
        code: 'EVALUATOR_UNDEFINED_IDENTIFIER',
        details: { name: 'x' },
        stack: 'Error: Test\n    at ...',
      });

      EvaluatorErrorConstructor.mockImplementation(() => mockError);

      // When
      const error = new EvaluatorError(options);

      // Then
      expect(EvaluatorErrorConstructor).toHaveBeenCalledWith(options);
      expect(error instanceof Error).toBe(true);
      expect(error.stack).toBeDefined();
    });

    test('에러를 throw할 수 있다', () => {
      // Given
      const options = {
        code: 'EVALUATOR_UNDEFINED_IDENTIFIER' as const,
        message: 'Test',
        details: { name: 'x' },
      };

      const mockError = Object.create(Error.prototype);
      Object.assign(mockError, {
        name: 'EvaluatorError',
        message: 'Test',
        code: 'EVALUATOR_UNDEFINED_IDENTIFIER',
        details: { name: 'x' },
      });

      EvaluatorErrorConstructor.mockImplementation(() => mockError);

      const error = new EvaluatorError(options);

      // When
      const when = () => {
        throw error;
      };

      // Then
      expect(EvaluatorErrorConstructor).toHaveBeenCalledWith(options);
      expect(when).toThrow();
      expect(when).toThrow('Test');
    });
  });
});
