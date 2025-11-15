import { FunctionExecutor } from '@core/evaluator/exec/functions.js';
import { Environment } from '@core/evaluator/runtime/environment.js';
import type { FunctionValue } from '@core/evaluator/runtime/values.js';
import type { BlockExecutor } from '@core/evaluator/exec/types.js';

describe('FunctionExecutor', () => {
  let executor: FunctionExecutor;
  let mockBlockExecutor: jest.MockedFunction<BlockExecutor>;

  beforeEach(() => {
    executor = new FunctionExecutor();
    mockBlockExecutor = jest.fn();
    executor.setBlockExecutor(mockBlockExecutor);
  });

  describe('setBlockExecutor', () => {
    test('블록 실행기를 설정한다', () => {
      // Given
      const newExecutor = new FunctionExecutor();
      const blockExecutor: BlockExecutor = jest.fn();

      // When
      newExecutor.setBlockExecutor(blockExecutor);

      // Then
      // 에러가 발생하지 않으면 성공
      expect(() => {
        newExecutor.setBlockExecutor(blockExecutor);
      }).not.toThrow();
    });
  });

  describe('callFunction', () => {
    test('블록 실행기가 설정되지 않으면 에러를 발생시킨다', () => {
      // Given
      const newExecutor = new FunctionExecutor();
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
      const when = () => newExecutor.callFunction(functionValue, []);

      // Then
      expect(when).toThrow(
        'FunctionExecutor에 블록 실행기가 설정되지 않았습니다.'
      );
    });

    test('매개변수가 없는 함수를 호출한다', () => {
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
      mockBlockExecutor.mockReturnValue(undefined);

      // When
      const result = executor.callFunction(functionValue, []);

      // Then
      expect(result).toBe(null);
      expect(mockBlockExecutor).toHaveBeenCalledTimes(1);
      const callArgs = mockBlockExecutor.mock.calls[0];
      expect(callArgs[0]).toBe(functionValue.declaration.body);
      expect(callArgs[1]).toBeInstanceOf(Environment);
      expect(callArgs[2]).toEqual({ inFunction: true });
    });

    test('매개변수가 있는 함수를 호출한다', () => {
      // Given
      const functionValue: FunctionValue = {
        kind: 'Function',
        declaration: {
          type: 'FunctionDeclaration',
          name: { type: 'IdentifierExpression', name: 'add' },
          params: [
            { type: 'IdentifierExpression', name: 'a' },
            { type: 'IdentifierExpression', name: 'b' },
          ],
          body: { type: 'BlockStatement', body: [] },
        },
        closure: new Environment(),
      };
      mockBlockExecutor.mockReturnValue(undefined);

      // When
      const result = executor.callFunction(functionValue, [1, 2]);

      // Then
      expect(result).toBe(null);
      expect(mockBlockExecutor).toHaveBeenCalledTimes(1);
      const callArgs = mockBlockExecutor.mock.calls[0];
      const localEnv = callArgs[1] as Environment;
      expect(localEnv.get('a')).toBe(1);
      expect(localEnv.get('b')).toBe(2);
    });

    test('함수가 값을 반환한다', () => {
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
      mockBlockExecutor.mockReturnValue({
        type: 'return',
        value: 123,
      });

      // When
      const result = executor.callFunction(functionValue, []);

      // Then
      expect(result).toBe(123);
    });

    test('함수가 null을 반환한다', () => {
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
      mockBlockExecutor.mockReturnValue({
        type: 'return',
        value: null,
      });

      // When
      const result = executor.callFunction(functionValue, []);

      // Then
      expect(result).toBe(null);
    });

    test('함수가 값을 반환하지 않으면 null을 반환한다', () => {
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
      mockBlockExecutor.mockReturnValue(undefined);

      // When
      const result = executor.callFunction(functionValue, []);

      // Then
      expect(result).toBe(null);
    });

    test('클로저 환경을 상속한다', () => {
      // Given
      const closure = new Environment();
      closure.declare('x', 123);
      const functionValue: FunctionValue = {
        kind: 'Function',
        declaration: {
          type: 'FunctionDeclaration',
          name: { type: 'IdentifierExpression', name: 'foo' },
          params: [],
          body: { type: 'BlockStatement', body: [] },
        },
        closure,
      };
      mockBlockExecutor.mockReturnValue(undefined);

      // When
      executor.callFunction(functionValue, []);

      // Then
      const callArgs = mockBlockExecutor.mock.calls[0];
      const localEnv = callArgs[1] as Environment;
      expect(localEnv.get('x')).toBe(123);
    });

    test('로컬 환경에서 클로저 변수를 가릴 수 있다', () => {
      // Given
      const closure = new Environment();
      closure.declare('x', 123);
      const functionValue: FunctionValue = {
        kind: 'Function',
        declaration: {
          type: 'FunctionDeclaration',
          name: { type: 'IdentifierExpression', name: 'foo' },
          params: [{ type: 'IdentifierExpression', name: 'x' }],
          body: { type: 'BlockStatement', body: [] },
        },
        closure,
      };
      mockBlockExecutor.mockReturnValue(undefined);

      // When
      executor.callFunction(functionValue, [456]);

      // Then
      const callArgs = mockBlockExecutor.mock.calls[0];
      const localEnv = callArgs[1] as Environment;
      expect(localEnv.get('x')).toBe(456); // 매개변수가 클로저 변수를 가림
    });
  });
});
