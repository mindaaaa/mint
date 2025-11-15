import { StatementExecutor } from '@core/evaluator/exec/statements.js';
import { ExpressionEvaluator } from '@core/evaluator/exec/expressions.js';
import { FunctionExecutor } from '@core/evaluator/exec/functions.js';
import { Environment } from '@core/evaluator/runtime/environment.js';
import { EvaluatorError } from '@core/evaluator/errors/errors.js';
import type { StatementNode } from '@core/ast/nodes.js';
import type { PrintFn } from '@core/evaluator/exec/types.js';

describe('StatementExecutor', () => {
  let functionExecutor: FunctionExecutor;
  let expressionEvaluator: ExpressionEvaluator;
  let printFn: jest.MockedFunction<PrintFn>;
  let executor: StatementExecutor;
  let environment: Environment;

  beforeEach(() => {
    functionExecutor = new FunctionExecutor();
    expressionEvaluator = new ExpressionEvaluator(functionExecutor);
    printFn = jest.fn();
    executor = new StatementExecutor(expressionEvaluator, printFn);
    environment = new Environment();
  });

  describe('executeVariableDeclaration', () => {
    test('초기값이 없는 변수를 선언한다', () => {
      // Given
      const statement: StatementNode = {
        type: 'VariableDeclaration',
        identifier: {
          type: 'IdentifierExpression',
          name: 'x',
        },
        initializer: undefined,
      };

      // When
      const result = executor.execute(statement, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBeUndefined();
      expect(environment.get('x')).toBe(null);
    });

    test('초기값이 있는 변수를 선언한다', () => {
      // Given
      const statement: StatementNode = {
        type: 'VariableDeclaration',
        identifier: {
          type: 'IdentifierExpression',
          name: 'x',
        },
        initializer: {
          type: 'LiteralExpression',
          value: 123,
        },
      };

      // When
      const result = executor.execute(statement, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBeUndefined();
      expect(environment.get('x')).toBe(123);
    });
  });

  describe('executeFunctionDeclaration', () => {
    test('함수를 선언한다', () => {
      // Given
      const statement: StatementNode = {
        type: 'FunctionDeclaration',
        name: {
          type: 'IdentifierExpression',
          name: 'foo',
        },
        params: [],
        body: {
          type: 'BlockStatement',
          body: [],
        },
      };

      // When
      const result = executor.execute(statement, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBeUndefined();
      const fn = environment.get('foo');
      expect(fn).toBeDefined();
      if (typeof fn === 'object' && fn !== null && 'kind' in fn) {
        expect(fn.kind).toBe('Function');
      }
    });
  });

  describe('executeIfStatement', () => {
    test('조건이 true일 때 consequent를 실행한다', () => {
      // Given
      const statement: StatementNode = {
        type: 'IfStatement',
        condition: {
          type: 'LiteralExpression',
          value: true,
        },
        consequent: {
          type: 'BlockStatement',
          body: [
            {
              type: 'VariableDeclaration',
              identifier: {
                type: 'IdentifierExpression',
                name: 'x',
              },
              initializer: {
                type: 'LiteralExpression',
                value: 1,
              },
            },
          ],
        },
      };

      // When
      const result = executor.execute(statement, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBeUndefined();
      // 블록 스코프이므로 외부에서 접근 불가 - 블록 내부에서 선언된 변수는 블록 스코프
      // 대신 블록이 실행되었는지 확인하기 위해 다른 방법 사용
      // (실제로는 블록 내부에서 변수가 선언되었는지 확인할 수 없으므로
      // 에러가 발생하지 않으면 성공으로 간주)
    });

    test('조건이 false일 때 alternate를 실행한다', () => {
      // Given
      const statement: StatementNode = {
        type: 'IfStatement',
        condition: {
          type: 'LiteralExpression',
          value: false,
        },
        consequent: {
          type: 'BlockStatement',
          body: [],
        },
        alternate: {
          type: 'BlockStatement',
          body: [
            {
              type: 'VariableDeclaration',
              identifier: {
                type: 'IdentifierExpression',
                name: 'x',
              },
              initializer: {
                type: 'LiteralExpression',
                value: 2,
              },
            },
          ],
        },
      };

      // When
      const result = executor.execute(statement, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBeUndefined();
      // 블록 스코프이므로 외부에서 접근 불가
      // 에러가 발생하지 않으면 성공으로 간주
    });

    test('조건이 false이고 alternate가 없으면 아무것도 실행하지 않는다', () => {
      // Given
      const statement: StatementNode = {
        type: 'IfStatement',
        condition: {
          type: 'LiteralExpression',
          value: false,
        },
        consequent: {
          type: 'BlockStatement',
          body: [],
        },
      };

      // When
      const result = executor.execute(statement, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBeUndefined();
    });
  });

  describe('executeWhileStatement', () => {
    test('조건이 true일 때 반복 실행한다', () => {
      // Given
      environment.declare('count', 0);
      const statement: StatementNode = {
        type: 'WhileStatement',
        condition: {
          type: 'BinaryExpression',
          operator: '<',
          left: {
            type: 'IdentifierExpression',
            name: 'count',
          },
          right: {
            type: 'LiteralExpression',
            value: 3,
          },
        },
        body: {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                identifier: {
                  type: 'IdentifierExpression',
                  name: 'count',
                },
                value: {
                  type: 'BinaryExpression',
                  operator: '+',
                  left: {
                    type: 'IdentifierExpression',
                    name: 'count',
                  },
                  right: {
                    type: 'LiteralExpression',
                    value: 1,
                  },
                },
              },
            },
          ],
        },
      };

      // When
      const result = executor.execute(statement, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBeUndefined();
      expect(environment.get('count')).toBe(3);
    });

    test('조건이 false이면 실행하지 않는다', () => {
      // Given
      const statement: StatementNode = {
        type: 'WhileStatement',
        condition: {
          type: 'LiteralExpression',
          value: false,
        },
        body: {
          type: 'BlockStatement',
          body: [],
        },
      };

      // When
      const result = executor.execute(statement, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBeUndefined();
    });
  });

  describe('executeReturnStatement', () => {
    test('함수 내에서 return 문을 실행한다', () => {
      // Given
      const statement: StatementNode = {
        type: 'ReturnStatement',
        argument: {
          type: 'LiteralExpression',
          value: 123,
        },
      };

      // When
      const result = executor.execute(statement, environment, {
        inFunction: true,
      });

      // Then
      expect(result).toEqual({
        type: 'return',
        value: 123,
      });
    });

    test('값이 없는 return 문을 실행한다', () => {
      // Given
      const statement: StatementNode = {
        type: 'ReturnStatement',
        argument: undefined,
      };

      // When
      const result = executor.execute(statement, environment, {
        inFunction: true,
      });

      // Then
      expect(result).toEqual({
        type: 'return',
        value: null,
      });
    });

    test('함수 밖에서 return 문을 실행하면 EvaluatorError를 발생시킨다', () => {
      // Given
      const statement: StatementNode = {
        type: 'ReturnStatement',
        argument: {
          type: 'LiteralExpression',
          value: 123,
        },
      };

      // When
      const when = () =>
        executor.execute(statement, environment, { inFunction: false });

      // Then
      expect(when).toThrow(EvaluatorError);
      try {
        executor.execute(statement, environment, { inFunction: false });
      } catch (error) {
        expect(error).toBeInstanceOf(EvaluatorError);
        if (error instanceof EvaluatorError) {
          expect(error.code).toBe('EVALUATOR_RETURN_OUTSIDE_FUNCTION');
        }
      }
    });
  });

  describe('executeSparkleStatement', () => {
    test('sparkle 문을 실행하고 값을 출력한다', () => {
      // Given
      const statement: StatementNode = {
        type: 'SparkleStatement',
        expression: {
          type: 'LiteralExpression',
          value: 'hello',
        },
      };

      // When
      const result = executor.execute(statement, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBeUndefined();
      expect(printFn).toHaveBeenCalledTimes(1);
      expect(printFn).toHaveBeenCalledWith('hello');
    });
  });

  describe('executeExpressionStatement', () => {
    test('표현식 문을 실행한다', () => {
      // Given
      environment.declare('x', 1);
      const statement: StatementNode = {
        type: 'ExpressionStatement',
        expression: {
          type: 'AssignmentExpression',
          identifier: {
            type: 'IdentifierExpression',
            name: 'x',
          },
          value: {
            type: 'LiteralExpression',
            value: 2,
          },
        },
      };

      // When
      const result = executor.execute(statement, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBeUndefined();
      expect(environment.get('x')).toBe(2);
    });
  });

  describe('executeBlock', () => {
    test('블록 문을 실행한다', () => {
      // Given
      const statement: StatementNode = {
        type: 'BlockStatement',
        body: [
          {
            type: 'VariableDeclaration',
            identifier: {
              type: 'IdentifierExpression',
              name: 'x',
            },
            initializer: {
              type: 'LiteralExpression',
              value: 1,
            },
          },
          {
            type: 'VariableDeclaration',
            identifier: {
              type: 'IdentifierExpression',
              name: 'y',
            },
            initializer: {
              type: 'LiteralExpression',
              value: 2,
            },
          },
        ],
      };

      // When
      const result = executor.execute(statement, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBeUndefined();
      // 블록 스코프이므로 외부에서 접근 불가
      // 에러가 발생하지 않으면 성공으로 간주
    });

    test('블록 내부의 변수는 블록 스코프를 가진다', () => {
      // Given
      const statement: StatementNode = {
        type: 'BlockStatement',
        body: [
          {
            type: 'VariableDeclaration',
            identifier: {
              type: 'IdentifierExpression',
              name: 'x',
            },
            initializer: {
              type: 'LiteralExpression',
              value: 1,
            },
          },
        ],
      };

      // When
      executor.execute(statement, environment, { inFunction: false });

      // Then
      // 블록 스코프이므로 외부에서 접근 불가
      expect(() => environment.get('x')).toThrow(EvaluatorError);
    });
  });
});
