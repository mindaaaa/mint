import {
  isTruthy,
  runtimeTypeOf,
  stringify,
} from '@core/evaluator/utils/value.js';
import { Environment } from '@core/evaluator/runtime/environment.js';
import type { FunctionValue } from '@core/evaluator/runtime/values.js';

describe('value utils', () => {
  describe('isTruthy', () => {
    test('숫자 0은 falsy이다', () => {
      // Given
      const value = 0;

      // When
      const result = isTruthy(value);

      // Then
      expect(result).toBe(false);
    });

    test('양수는 truthy이다', () => {
      // Given
      const value = 123;

      // When
      const result = isTruthy(value);

      // Then
      expect(result).toBe(true);
    });

    test('음수는 truthy이다', () => {
      // Given
      const value = -1;

      // When
      const result = isTruthy(value);

      // Then
      expect(result).toBe(true);
    });

    test('빈 문자열은 falsy이다', () => {
      // Given
      const value = '';

      // When
      const result = isTruthy(value);

      // Then
      expect(result).toBe(false);
    });

    test('비어있지 않은 문자열은 truthy이다', () => {
      // Given
      const value = 'hello';

      // When
      const result = isTruthy(value);

      // Then
      expect(result).toBe(true);
    });

    test('false는 falsy이다', () => {
      // Given
      const value = false;

      // When
      const result = isTruthy(value);

      // Then
      expect(result).toBe(false);
    });

    test('true는 truthy이다', () => {
      // Given
      const value = true;

      // When
      const result = isTruthy(value);

      // Then
      expect(result).toBe(true);
    });

    test('null은 falsy이다', () => {
      // Given
      const value = null;

      // When
      const result = isTruthy(value);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('runtimeTypeOf', () => {
    test('숫자의 타입을 반환한다', () => {
      // Given
      const value = 123;

      // When
      const type = runtimeTypeOf(value);

      // Then
      expect(type).toBe('number');
    });

    test('문자열의 타입을 반환한다', () => {
      // Given
      const value = 'hello';

      // When
      const type = runtimeTypeOf(value);

      // Then
      expect(type).toBe('string');
    });

    test('불린의 타입을 반환한다', () => {
      // Given
      const value = true;

      // When
      const type = runtimeTypeOf(value);

      // Then
      expect(type).toBe('boolean');
    });

    test('null의 타입을 반환한다', () => {
      // Given
      const value = null;

      // When
      const type = runtimeTypeOf(value);

      // Then
      expect(type).toBe('null');
    });

    test('함수의 타입을 반환한다', () => {
      // Given
      const value: FunctionValue = {
        kind: 'Function',
        declaration: {
          type: 'FunctionDeclaration',
          name: { type: 'IdentifierExpression', name: 'foo' },
          params: [],
          body: { type: 'BlockStatement', body: [] },
        },
        closure: new Environment(),
      };

      // When
      const type = runtimeTypeOf(value);

      // Then
      expect(type).toBe('function');
    });
  });

  describe('stringify', () => {
    test('숫자를 문자열로 변환한다', () => {
      // Given
      const value = 123;

      // When
      const result = stringify(value);

      // Then
      expect(result).toBe('123');
    });

    test('문자열은 그대로 반환한다', () => {
      // Given
      const value = 'hello';

      // When
      const result = stringify(value);

      // Then
      expect(result).toBe('hello');
    });

    test('true를 문자열로 변환한다', () => {
      // Given
      const value = true;

      // When
      const result = stringify(value);

      // Then
      expect(result).toBe('true');
    });

    test('false를 문자열로 변환한다', () => {
      // Given
      const value = false;

      // When
      const result = stringify(value);

      // Then
      expect(result).toBe('false');
    });

    test('null을 문자열로 변환한다', () => {
      // Given
      const value = null;

      // When
      const result = stringify(value);

      // Then
      expect(result).toBe('null');
    });

    test('함수를 문자열로 변환한다', () => {
      // Given
      const value: FunctionValue = {
        kind: 'Function',
        declaration: {
          type: 'FunctionDeclaration',
          name: { type: 'IdentifierExpression', name: 'foo' },
          params: [],
          body: { type: 'BlockStatement', body: [] },
        },
        closure: new Environment(),
      };

      // When
      const result = stringify(value);

      // Then
      expect(result).toBe('<function foo>');
    });

    test('이름이 없는 함수를 문자열로 변환한다', () => {
      // Given
      const value: FunctionValue = {
        kind: 'Function',
        declaration: {
          type: 'FunctionDeclaration',
          name: { type: 'IdentifierExpression', name: '' },
          params: [],
          body: { type: 'BlockStatement', body: [] },
        },
        closure: new Environment(),
      };

      // When
      const result = stringify(value);

      // Then
      // 빈 문자열일 때는 <anonymous>가 아니라 빈 문자열이 반환됨
      expect(result).toBe('<function >');
    });
  });
});
