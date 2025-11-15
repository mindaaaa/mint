import { isFunctionValue, type FunctionValue } from '@core/evaluator/runtime/values.js';
import type { FunctionDeclarationNode } from '@core/ast/nodes.js';
import { Environment } from '@core/evaluator/runtime/environment.js';

describe('runtime values', () => {
  describe('isFunctionValue', () => {
    test('FunctionValue를 올바르게 식별한다', () => {
      // Given
      const functionValue: FunctionValue = {
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
      const result = isFunctionValue(functionValue);

      // Then
      expect(result).toBe(true);
    });

    test('숫자는 함수가 아니다', () => {
      // Given
      const value = 123;

      // When
      const result = isFunctionValue(value);

      // Then
      expect(result).toBe(false);
    });

    test('문자열은 함수가 아니다', () => {
      // Given
      const value = 'hello';

      // When
      const result = isFunctionValue(value);

      // Then
      expect(result).toBe(false);
    });

    test('불린은 함수가 아니다', () => {
      // Given
      const value = true;

      // When
      const result = isFunctionValue(value);

      // Then
      expect(result).toBe(false);
    });

    test('null은 함수가 아니다', () => {
      // Given
      const value = null;

      // When
      const result = isFunctionValue(value);

      // Then
      expect(result).toBe(false);
    });

    test('일반 객체는 함수가 아니다', () => {
      // Given
      const value = { kind: 'NotFunction' } as any;

      // When
      const result = isFunctionValue(value);

      // Then
      expect(result).toBe(false);
    });

    test('kind가 Function이 아닌 객체는 함수가 아니다', () => {
      // Given
      const value = {
        kind: 'NotFunction',
        declaration: {} as FunctionDeclarationNode,
        closure: new Environment(),
      } as any;

      // When
      const result = isFunctionValue(value);

      // Then
      expect(result).toBe(false);
    });
  });
});

