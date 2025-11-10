import type { BlockStatementNode, StatementNode } from '@core/ast/nodes.js';
import { createEvaluatorError } from '@core/errors/factory.js';
import { Environment } from '@core/evaluator/runtime/environment.js';
import type { FunctionValue } from '@core/evaluator/runtime/values.js';
import { stringify, isTruthy } from '@core/evaluator/utils/value.js';
import type { ExpressionEvaluator } from './expressions.js';
import type { ExecutionContext, PrintFn, ReturnSignal } from './types.js';

export class StatementExecutor {
  constructor(
    private readonly expressionEvaluator: ExpressionEvaluator,
    private readonly print: PrintFn
  ) {}

  /**
   * 단일 문장을 실행한다.
   *
   * @param statement 실행할 문장
   * @param environment 현재 환경
   * @param context 실행 컨텍스트
   * @returns 리턴 신호(있다면)
   */
  execute(
    statement: StatementNode,
    environment: Environment,
    context: ExecutionContext
  ): ReturnSignal | undefined {
    switch (statement.type) {
      case 'VariableDeclaration':
        return this.executeVariableDeclaration(statement, environment, context);
      case 'FunctionDeclaration':
        return this.executeFunctionDeclaration(statement, environment);
      case 'IfStatement':
        return this.executeIfStatement(statement, environment, context);
      case 'WhileStatement':
        return this.executeWhileStatement(statement, environment, context);
      case 'ReturnStatement':
        return this.executeReturnStatement(statement, environment, context);
      case 'SparkleStatement':
        return this.executeSparkleStatement(statement, environment, context);
      case 'ExpressionStatement':
        return this.executeExpressionStatement(statement, environment, context);
      case 'BlockStatement':
        return this.executeBlock(statement, environment.createChild(), context);
      default: {
        const exhaustive: never = statement;
        return exhaustive;
      }
    }
  }

  /**
   * 블록 문장을 실행한다.
   *
   * @param block 실행할 블록
   * @param environment 블록용 환경
   * @param context 실행 컨텍스트
   * @returns 리턴 신호(있다면)
   */
  executeBlock(
    block: BlockStatementNode,
    environment: Environment,
    context: ExecutionContext
  ): ReturnSignal | undefined {
    for (const statement of block.body) {
      const returnSignal = this.execute(statement, environment, context);

      if (returnSignal) {
        return returnSignal;
      }
    }
    return undefined;
  }

  /**
   * 변수 선언 문을 실행한다.
   *
   * @param statement VariableDeclaration 문
   * @param environment 현재 환경
   * @param context 실행 컨텍스트
   * @returns 리턴 신호(없음)
   */
  private executeVariableDeclaration(
    statement: Extract<StatementNode, { type: 'VariableDeclaration' }>,
    environment: Environment,
    context: ExecutionContext
  ): ReturnSignal | undefined {
    const value = this.evaluateVariableInitializer(
      statement,
      environment,
      context
    );
    environment.declare(statement.identifier.name, value);
    return undefined;
  }

  /**
   * 변수 초기화 값을 평가한다.
   *
   * @param statement VariableDeclaration 문
   * @param environment 현재 환경
   * @param context 실행 컨텍스트
   * @returns 변수 초기화 값
   */
  private evaluateVariableInitializer(
    statement: Extract<StatementNode, { type: 'VariableDeclaration' }>,
    environment: Environment,
    context: ExecutionContext
  ): ReturnSignal['value'] {
    if (statement.initializer === undefined) {
      return null;
    }
    return this.expressionEvaluator.evaluate(
      statement.initializer,
      environment,
      context
    );
  }

  /**
   * 함수 선언 문을 실행한다.
   *
   * @param statement FunctionDeclaration 문
   * @param environment 현재 환경
   * @returns 리턴 신호(없음)
   */
  private executeFunctionDeclaration(
    statement: Extract<StatementNode, { type: 'FunctionDeclaration' }>,
    environment: Environment
  ): ReturnSignal | undefined {
    const fn: FunctionValue = {
      kind: 'Function',
      declaration: statement,
      closure: environment,
    };
    environment.declare(statement.name.name, fn);
    return undefined;
  }

  /**
   * if 문을 실행한다.
   *
   * @param statement IfStatement 문
   * @param environment 현재 환경
   * @param context 실행 컨텍스트
   * @returns 리턴 신호(있다면)
   */
  private executeIfStatement(
    statement: Extract<StatementNode, { type: 'IfStatement' }>,
    environment: Environment,
    context: ExecutionContext
  ): ReturnSignal | undefined {
    const condition = this.expressionEvaluator.evaluate(
      statement.condition,
      environment,
      context
    );

    if (isTruthy(condition)) {
      return this.executeBlock(
        statement.consequent,
        environment.createChild(),
        context
      );
    }

    if (statement.alternate) {
      return this.executeBlock(
        statement.alternate,
        environment.createChild(),
        context
      );
    }
    return undefined;
  }

  /**
   * while 문을 실행한다.
   *
   * @param statement WhileStatement 문
   * @param environment 현재 환경
   * @param context 실행 컨텍스트
   * @returns 리턴 신호(있다면)
   */
  private executeWhileStatement(
    statement: Extract<StatementNode, { type: 'WhileStatement' }>,
    environment: Environment,
    context: ExecutionContext
  ): ReturnSignal | undefined {
    while (
      isTruthy(
        this.expressionEvaluator.evaluate(
          statement.condition,
          environment,
          context
        )
      )
    ) {
      const returnSignal = this.executeBlock(
        statement.body,
        environment.createChild(),
        context
      );

      if (returnSignal) {
        return returnSignal;
      }
    }
    return undefined;
  }

  /**
   * return 문을 실행한다.
   *
   * @param statement ReturnStatement 문
   * @param environment 현재 환경
   * @param context 실행 컨텍스트
   * @returns 리턴 신호(반환 값 포함)
   */
  private executeReturnStatement(
    statement: Extract<StatementNode, { type: 'ReturnStatement' }>,
    environment: Environment,
    context: ExecutionContext
  ): ReturnSignal | undefined {
    if (!context.inFunction) {
      throw createEvaluatorError(
        'EVALUATOR_RETURN_OUTSIDE_FUNCTION',
        undefined
      );
    }

    const value =
      statement.argument !== undefined
        ? this.expressionEvaluator.evaluate(
            statement.argument,
            environment,
            context
          )
        : null;

    return {
      type: 'return',
      value,
    };
  }

  /**
   * sparkle 문을 실행한다.
   *
   * @param statement SparkleStatement 문
   * @param environment 현재 환경
   * @param context 실행 컨텍스트
   * @returns 리턴 신호(없음)
   */
  private executeSparkleStatement(
    statement: Extract<StatementNode, { type: 'SparkleStatement' }>,
    environment: Environment,
    context: ExecutionContext
  ): ReturnSignal | undefined {
    const value = this.expressionEvaluator.evaluate(
      statement.expression,
      environment,
      context
    );
    this.print(stringify(value));

    return undefined;
  }

  /**
   * 표현식 문을 실행한다.
   *
   * @param statement ExpressionStatement 문
   * @param environment 현재 환경
   * @param context 실행 컨텍스트
   * @returns 리턴 신호(없음)
   */
  private executeExpressionStatement(
    statement: Extract<StatementNode, { type: 'ExpressionStatement' }>,
    environment: Environment,
    context: ExecutionContext
  ): ReturnSignal | undefined {
    this.expressionEvaluator.evaluate(
      statement.expression,
      environment,
      context
    );
    return undefined;
  }
}
