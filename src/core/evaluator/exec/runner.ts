import type { ProgramNode } from '@core/ast/nodes.js';
import { createEvaluatorError } from '@core/errors/factory.js';
import { Environment } from '@core/evaluator/runtime/environment.js';
import { ExpressionEvaluator } from './expressions.js';
import { FunctionExecutor } from './functions.js';
import { StatementExecutor } from './statements.js';
import type { ExecutionContext, PrintFn } from './types.js';

export interface EvaluateOptions {
  environment?: Environment;
  stdout?: (value: string) => void;
}

export interface EvaluateResult {
  stdout: string[];
  environment: Environment;
}

interface EvaluatorContext {
  environment: Environment;
  stdout: string[];
  print: PrintFn;
  statementExecutor: StatementExecutor;
}

/**
 * AST Program 노드를 실행하여 결과와 환경을 반환한다.
 *
 * @param program 실행할 Program 노드
 * @param options 실행 옵션 (외부 환경, stdout 콜백 등)
 * @returns 평가 결과(출력 버퍼와 최종 환경)
 */
export function evaluateProgram(
  program: ProgramNode,
  options: EvaluateOptions = {}
): EvaluateResult {
  const evaluator = initializeEvaluator(options);
  const context: ExecutionContext = { inFunction: false };

  executeProgramBody(program, evaluator, context);

  return {
    stdout: evaluator.stdout,
    environment: evaluator.environment,
  };
}

/**
 * 평가기 주요 구성 요소를 초기화한다.
 *
 * @param options 실행 옵션
 * @returns 평가 컨텍스트 (환경, 출력 버퍼, 실행기 등)
 */
function initializeEvaluator(options: EvaluateOptions): EvaluatorContext {
  const environment = options.environment ?? new Environment();
  const stdout: string[] = [];
  const print: PrintFn = (value) => {
    stdout.push(value);
    options.stdout?.(value);
  };

  const functionExecutor = new FunctionExecutor();
  const expressionEvaluator = new ExpressionEvaluator(functionExecutor);
  const statementExecutor = new StatementExecutor(expressionEvaluator, print);

  functionExecutor.setBlockExecutor(
    statementExecutor.executeBlock.bind(statementExecutor)
  );

  return { environment, stdout, print, statementExecutor };
}

/**
 * Program AST의 문장들을 순차 실행한다.
 *
 * @param program 실행할 Program 노드
 * @param evaluator 평가 컨텍스트
 * @param context 실행 컨텍스트
 */
function executeProgramBody(
  program: ProgramNode,
  evaluator: EvaluatorContext,
  context: ExecutionContext
): void {
  for (const statement of program.body) {
    const signal = evaluator.statementExecutor.execute(
      statement,
      evaluator.environment,
      context
    );

    if (signal?.type === 'return') {
      throw createEvaluatorError(
        'EVALUATOR_RETURN_OUTSIDE_FUNCTION',
        undefined
      );
    }
  }
}
