import type { ExpressionNode } from '@core/ast/nodes.js';
import { createEvaluatorError } from '@core/errors/factory.js';
import type { Environment } from '@core/evaluator/runtime/environment.js';
import {
  isFunctionValue,
  type FunctionValue,
  type RuntimeValue,
} from '@core/evaluator/runtime/values.js';
import { isTruthy, runtimeTypeOf } from '@core/evaluator/utils/value.js';
import type { FunctionExecutor } from './functions.js';
import type { ExecutionContext } from './types.js';

type UnaryHandler = (value: RuntimeValue) => RuntimeValue;
type BinaryHandler = (left: RuntimeValue, right: RuntimeValue) => RuntimeValue;

export class ExpressionEvaluator {
  constructor(private readonly functionExecutor: FunctionExecutor) {}

  /**
   * 단항 연산자별 평가 핸들러 매핑.
   */
  private readonly unaryHandlers: Record<string, UnaryHandler> = {
    '-': (value) => {
      const numeric = this.expectNumber('-', value);
      return -numeric;
    },
    '!': (value) => !isTruthy(value),
  };

  /**
   * 이항 연산자별 평가 핸들러 매핑.
   */
  private readonly binaryHandlers: Record<string, BinaryHandler> = {
    '+': (left, right) => {
      if (typeof left === 'number' && typeof right === 'number') {
        return left + right;
      }

      if (typeof left === 'string' && typeof right === 'string') {
        return left + right;
      }
      this.throwTypeError('+', [left, right]);
    },
    '-': (left, right) => {
      const [leftNumber, rightNumber] = this.expectNumbers('-', left, right);
      return leftNumber - rightNumber;
    },
    '*': (left, right) => {
      const [leftNumber, rightNumber] = this.expectNumbers('*', left, right);
      return leftNumber * rightNumber;
    },
    '/': (left, right) => {
      const [leftNumber, rightNumber] = this.expectNumbers('/', left, right);
      return leftNumber / rightNumber;
    },
    '==': (left, right) => {
      this.ensureSameRuntimeType('==', left, right);
      return left === right;
    },
    '<': (left, right) => {
      const [leftNumber, rightNumber] = this.expectNumbers('<', left, right);
      return leftNumber < rightNumber;
    },
  };

  /**
   * 표현식 AST 노드를 평가한다.
   *
   * @param expression 평가할 표현식
   * @param environment 현재 환경
   * @param context 실행 컨텍스트
   * @returns 계산된 값
   */
  evaluate(
    expression: ExpressionNode,
    environment: Environment,
    context: ExecutionContext
  ): RuntimeValue {
    switch (expression.type) {
      case 'LiteralExpression':
        return expression.value;
      case 'IdentifierExpression':
        return environment.get(expression.name);
      case 'GroupingExpression':
        return this.evaluate(expression.expression, environment, context);
      case 'UnaryExpression':
        return this.evaluateUnary(
          expression.operator,
          expression.argument,
          environment,
          context
        );
      case 'BinaryExpression':
        return this.evaluateBinary(expression, environment, context);
      case 'AssignmentExpression': {
        const value = this.evaluate(expression.value, environment, context);
        return environment.assign(expression.identifier.name, value);
      }
      case 'CallExpression':
        return this.evaluateCallExpression(expression, environment, context);
      default: {
        const exhaustive: never = expression;
        return exhaustive;
      }
    }
  }

  /**
   * 피연산자가 숫자인지 확인한 뒤 숫자 값을 반환한다.
   *
   * @param operator 적용 중인 연산자
   * @param operand 검사할 피연산자
   * @returns 숫자형으로 검증된 피연산자
   */
  private expectNumber(operator: string, operand: RuntimeValue): number {
    if (typeof operand !== 'number') {
      this.throwTypeError(operator, [operand]);
    }
    return operand;
  }

  /**
   * 단항 연산자를 평가한다.
   *
   * @param operator 연산자 기호
   * @param argument 피연산자 표현식
   * @param environment 현재 환경
   * @param context 실행 컨텍스트
   * @returns 계산된 값
   */
  private evaluateUnary(
    operator: string,
    argument: ExpressionNode,
    environment: Environment,
    context: ExecutionContext
  ): RuntimeValue {
    const value = this.evaluate(argument, environment, context);
    const handler = this.unaryHandlers[operator];
    if (!handler) {
      this.throwTypeError(operator, [value]);
    }
    return handler(value);
  }

  /**
   * 이항 연산자를 평가한다.
   *
   * @param expression 이항 표현식 노드
   * @param environment 현재 환경
   * @param context 실행 컨텍스트
   * @returns 계산된 값
   */
  private evaluateBinary(
    expression: Extract<ExpressionNode, { type: 'BinaryExpression' }>,
    environment: Environment,
    context: ExecutionContext
  ): RuntimeValue {
    const left = this.evaluate(expression.left, environment, context);
    const right = this.evaluate(expression.right, environment, context);

    const handler = this.binaryHandlers[expression.operator];
    if (!handler) {
      this.throwTypeError(expression.operator, [left, right]);
    }
    return handler(left, right);
  }

  /**
   * 함수 호출 표현식을 평가한다.
   *
   * @param expression 호출 표현식 노드
   * @param environment 현재 환경
   * @param context 실행 컨텍스트
   * @returns 함수 호출 결과
   */
  private evaluateCallExpression(
    expression: Extract<ExpressionNode, { type: 'CallExpression' }>,
    environment: Environment,
    context: ExecutionContext
  ): RuntimeValue {
    const calleeValue = this.evaluate(expression.callee, environment, context);
    const callee = this.expectFunction(calleeValue);

    const args = expression.args.map((arg) =>
      this.evaluate(arg, environment, context)
    );

    this.ensureArgumentCount(callee, args);
    return this.functionExecutor.callFunction(callee, args);
  }

  /**
   * 두 피연산자가 모두 숫자인지 확인하고 숫자 값 쌍을 반환한다.
   *
   * @param operator 적용 중인 연산자
   * @param left 왼쪽 피연산자
   * @param right 오른쪽 피연산자
   * @returns 숫자형으로 검증된 피연산자 쌍
   */
  private expectNumbers(
    operator: string,
    left: RuntimeValue,
    right: RuntimeValue
  ): [number, number] {
    return [
      this.expectNumber(operator, left),
      this.expectNumber(operator, right),
    ];
  }

  /**
   * 두 피연산자의 런타임 타입이 동일한지 검증한다.
   *
   * @param operator 적용 중인 연산자
   * @param left 왼쪽 피연산자
   * @param right 오른쪽 피연산자
   */
  private ensureSameRuntimeType(
    operator: string,
    left: RuntimeValue,
    right: RuntimeValue
  ): void {
    if (runtimeTypeOf(left) !== runtimeTypeOf(right)) {
      this.throwTypeError(operator, [left, right]);
    }
  }

  /**
   * 호출 대상이 함수인지 검증하고 함수 값을 반환한다.
   *
   * @param callee 호출 대상
   * @returns 함수 런타임 값
   */
  private expectFunction(callee: RuntimeValue): FunctionValue {
    if (!isFunctionValue(callee)) {
      throw createEvaluatorError('EVALUATOR_NOT_CALLABLE', {
        type: runtimeTypeOf(callee),
      });
    }
    return callee;
  }

  /**
   * 전달된 인수 개수가 선언과 일치하는지 검증한다.
   *
   * @param callee 함수 런타임 값
   * @param args 전달된 인수 리스트
   */
  private ensureArgumentCount(
    callee: FunctionValue,
    args: RuntimeValue[]
  ): void {
    const expected = callee.declaration.params.length;
    if (args.length !== expected) {
      throw createEvaluatorError('EVALUATOR_ARGUMENT_COUNT_MISMATCH', {
        expected,
        received: args.length,
      });
    }
  }

  /**
   * 연산자 타입 오류를 생성하여 예외를 던진다.
   *
   * @param operator 문제를 발생시킨 연산자
   * @param operands 연산에 사용된 피연산자 목록
   * @throws EvaluatorError 타입이 올바르지 않은 경우
   */
  private throwTypeError(operator: string, operands: RuntimeValue[]): never {
    throw createEvaluatorError('EVALUATOR_TYPE_ERROR', {
      operator,
      operandTypes: operands.map(runtimeTypeOf),
    });
  }
}
