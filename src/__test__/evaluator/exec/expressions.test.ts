import { ExpressionEvaluator } from '@core/evaluator/exec/expressions.js';
import { FunctionExecutor } from '@core/evaluator/exec/functions.js';
import { Environment } from '@core/evaluator/runtime/environment.js';
import { EvaluatorError } from '@core/evaluator/errors/errors.js';
import type { ExpressionNode } from '@core/ast/nodes.js';

describe('ExpressionEvaluator', () => {
  let functionExecutor: FunctionExecutor;
  let evaluator: ExpressionEvaluator;
  let environment: Environment;

  beforeEach(() => {
    functionExecutor = new FunctionExecutor();
    evaluator = new ExpressionEvaluator(functionExecutor);
    environment = new Environment();
  });

  describe('LiteralExpression', () => {
    test('숫자 리터럴을 평가한다', () => {
      // Given
      const expression: ExpressionNode = {
        type: 'LiteralExpression',
        value: 123,
      };

      // When
      const result = evaluator.evaluate(expression, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBe(123);
    });

    test('문자열 리터럴을 평가한다', () => {
      // Given
      const expression: ExpressionNode = {
        type: 'LiteralExpression',
        value: 'hello',
      };

      // When
      const result = evaluator.evaluate(expression, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBe('hello');
    });

    test('불린 리터럴을 평가한다', () => {
      // Given
      const expression: ExpressionNode = {
        type: 'LiteralExpression',
        value: true,
      };

      // When
      const result = evaluator.evaluate(expression, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBe(true);
    });

    test('null 리터럴을 평가한다', () => {
      // Given
      const expression: ExpressionNode = {
        type: 'LiteralExpression',
        value: null,
      };

      // When
      const result = evaluator.evaluate(expression, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBe(null);
    });
  });

  describe('IdentifierExpression', () => {
    test('식별자 값을 조회한다', () => {
      // Given
      environment.declare('x', 123);
      const expression: ExpressionNode = {
        type: 'IdentifierExpression',
        name: 'x',
      };

      // When
      const result = evaluator.evaluate(expression, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBe(123);
    });

    test('존재하지 않는 식별자는 EvaluatorError를 발생시킨다', () => {
      // Given
      const expression: ExpressionNode = {
        type: 'IdentifierExpression',
        name: 'x',
      };

      // When
      const when = () =>
        evaluator.evaluate(expression, environment, { inFunction: false });

      // Then
      expect(when).toThrow(EvaluatorError);
      try {
        evaluator.evaluate(expression, environment, { inFunction: false });
      } catch (error) {
        expect(error).toBeInstanceOf(EvaluatorError);
        if (error instanceof EvaluatorError) {
          expect(error.code).toBe('EVALUATOR_UNDEFINED_IDENTIFIER');
        }
      }
    });
  });

  describe('GroupingExpression', () => {
    test('그룹핑 표현식을 평가한다', () => {
      // Given
      const expression: ExpressionNode = {
        type: 'GroupingExpression',
        expression: {
          type: 'LiteralExpression',
          value: 123,
        },
      };

      // When
      const result = evaluator.evaluate(expression, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBe(123);
    });
  });

  describe('UnaryExpression', () => {
    test('단항 부정 연산자를 평가한다', () => {
      // Given
      const expression: ExpressionNode = {
        type: 'UnaryExpression',
        operator: '!',
        argument: {
          type: 'LiteralExpression',
          value: true,
        },
      };

      // When
      const result = evaluator.evaluate(expression, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBe(false);
    });

    test('단항 음수 연산자를 평가한다', () => {
      // Given
      const expression: ExpressionNode = {
        type: 'UnaryExpression',
        operator: '-',
        argument: {
          type: 'LiteralExpression',
          value: 123,
        },
      };

      // When
      const result = evaluator.evaluate(expression, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBe(-123);
    });

    test('숫자가 아닌 값에 단항 음수 연산자를 적용하면 EvaluatorError를 발생시킨다', () => {
      // Given
      const expression: ExpressionNode = {
        type: 'UnaryExpression',
        operator: '-',
        argument: {
          type: 'LiteralExpression',
          value: 'hello',
        },
      };

      // When
      const when = () =>
        evaluator.evaluate(expression, environment, { inFunction: false });

      // Then
      expect(when).toThrow(EvaluatorError);
      try {
        evaluator.evaluate(expression, environment, { inFunction: false });
      } catch (error) {
        expect(error).toBeInstanceOf(EvaluatorError);
        if (error instanceof EvaluatorError) {
          expect(error.code).toBe('EVALUATOR_TYPE_ERROR');
        }
      }
    });
  });

  describe('BinaryExpression', () => {
    test('덧셈 연산자를 평가한다', () => {
      // Given
      const expression: ExpressionNode = {
        type: 'BinaryExpression',
        operator: '+',
        left: {
          type: 'LiteralExpression',
          value: 1,
        },
        right: {
          type: 'LiteralExpression',
          value: 2,
        },
      };

      // When
      const result = evaluator.evaluate(expression, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBe(3);
    });

    test('문자열 덧셈 연산자를 평가한다', () => {
      // Given
      const expression: ExpressionNode = {
        type: 'BinaryExpression',
        operator: '+',
        left: {
          type: 'LiteralExpression',
          value: 'hello',
        },
        right: {
          type: 'LiteralExpression',
          value: ' world',
        },
      };

      // When
      const result = evaluator.evaluate(expression, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBe('hello world');
    });

    test('뺄셈 연산자를 평가한다', () => {
      // Given
      const expression: ExpressionNode = {
        type: 'BinaryExpression',
        operator: '-',
        left: {
          type: 'LiteralExpression',
          value: 5,
        },
        right: {
          type: 'LiteralExpression',
          value: 3,
        },
      };

      // When
      const result = evaluator.evaluate(expression, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBe(2);
    });

    test('곱셈 연산자를 평가한다', () => {
      // Given
      const expression: ExpressionNode = {
        type: 'BinaryExpression',
        operator: '*',
        left: {
          type: 'LiteralExpression',
          value: 2,
        },
        right: {
          type: 'LiteralExpression',
          value: 3,
        },
      };

      // When
      const result = evaluator.evaluate(expression, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBe(6);
    });

    test('나눗셈 연산자를 평가한다', () => {
      // Given
      const expression: ExpressionNode = {
        type: 'BinaryExpression',
        operator: '/',
        left: {
          type: 'LiteralExpression',
          value: 6,
        },
        right: {
          type: 'LiteralExpression',
          value: 2,
        },
      };

      // When
      const result = evaluator.evaluate(expression, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBe(3);
    });

    test('동등 비교 연산자를 평가한다', () => {
      // Given
      const expression: ExpressionNode = {
        type: 'BinaryExpression',
        operator: '==',
        left: {
          type: 'LiteralExpression',
          value: 1,
        },
        right: {
          type: 'LiteralExpression',
          value: 1,
        },
      };

      // When
      const result = evaluator.evaluate(expression, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBe(true);
    });

    test('작음 비교 연산자를 평가한다', () => {
      // Given
      const expression: ExpressionNode = {
        type: 'BinaryExpression',
        operator: '<',
        left: {
          type: 'LiteralExpression',
          value: 1,
        },
        right: {
          type: 'LiteralExpression',
          value: 2,
        },
      };

      // When
      const result = evaluator.evaluate(expression, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBe(true);
    });

    test('타입이 다른 피연산자로 덧셈을 수행하면 EvaluatorError를 발생시킨다', () => {
      // Given
      const expression: ExpressionNode = {
        type: 'BinaryExpression',
        operator: '+',
        left: {
          type: 'LiteralExpression',
          value: 1,
        },
        right: {
          type: 'LiteralExpression',
          value: 'hello',
        },
      };

      // When
      const when = () =>
        evaluator.evaluate(expression, environment, { inFunction: false });

      // Then
      expect(when).toThrow(EvaluatorError);
      try {
        evaluator.evaluate(expression, environment, { inFunction: false });
      } catch (error) {
        expect(error).toBeInstanceOf(EvaluatorError);
        if (error instanceof EvaluatorError) {
          expect(error.code).toBe('EVALUATOR_TYPE_ERROR');
        }
      }
    });

    test('타입이 다른 피연산자로 동등 비교를 수행하면 EvaluatorError를 발생시킨다', () => {
      // Given
      const expression: ExpressionNode = {
        type: 'BinaryExpression',
        operator: '==',
        left: {
          type: 'LiteralExpression',
          value: 1,
        },
        right: {
          type: 'LiteralExpression',
          value: 'hello',
        },
      };

      // When
      const when = () =>
        evaluator.evaluate(expression, environment, { inFunction: false });

      // Then
      expect(when).toThrow(EvaluatorError);
      try {
        evaluator.evaluate(expression, environment, { inFunction: false });
      } catch (error) {
        expect(error).toBeInstanceOf(EvaluatorError);
        if (error instanceof EvaluatorError) {
          expect(error.code).toBe('EVALUATOR_TYPE_ERROR');
        }
      }
    });
  });

  describe('AssignmentExpression', () => {
    test('변수에 값을 대입한다', () => {
      // Given
      environment.declare('x', 1);
      const expression: ExpressionNode = {
        type: 'AssignmentExpression',
        identifier: {
          type: 'IdentifierExpression',
          name: 'x',
        },
        value: {
          type: 'LiteralExpression',
          value: 2,
        },
      };

      // When
      const result = evaluator.evaluate(expression, environment, {
        inFunction: false,
      });

      // Then
      expect(result).toBe(2);
      expect(environment.get('x')).toBe(2);
    });
  });
});
