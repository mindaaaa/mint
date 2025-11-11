import { tokenize } from '@core/lexer/lexer.js';
import { parse } from '@core/parser/parser.js';
import { evaluateProgram } from '@core/evaluator/exec/runner.js';
import type { EvaluateOptions } from '@core/evaluator/exec/runner.js';
import type { MintErrorContext } from './errors.js';
import { toMintError } from './errors.js';

export interface RunSourceOptions {
  filename?: string;
  stdout?: EvaluateOptions['stdout'];
}

export interface RunSuccess {
  ok: true;
  stdout: string[];
}

export interface RunFailure {
  ok: false;
  error: ReturnType<typeof toMintError>;
}

export type RunResult = RunSuccess | RunFailure;

/**
 * 소스 코드를 실행하여 결과 또는 에러를 반환한다.
 *
 * @param source 실행할 소스 코드
 * @param options 실행 옵션 (파일명, stdout 콜백 등)
 * @returns 실행 성공 여부와 결과
 */
export function runSource(
  source: string,
  options: RunSourceOptions = {}
): RunResult {
  const context: MintErrorContext = { filePath: options.filename };

  try {
    return executeSource(source, options);
  } catch (error) {
    return toRunFailure(error, context);
  }
}

/**
 * 소스 코드를 실행하여 결과를 반환한다.
 *
 * @param source 실행할 소스 코드
 * @param options 실행 옵션 (파일명, stdout 콜백 등)
 * @returns 실행 성공 여부와 결과
 */
function executeSource(source: string, options: RunSourceOptions): RunSuccess {
  const tokens = tokenize(source);
  const program = parse(tokens);
  const result = evaluateProgram(program, {
    stdout: (value) => {
      options.stdout?.(value);
    },
  });

  return {
    ok: true,
    stdout: result.stdout,
  };
}

/**
 * 에러를 실행 실패 결과로 변환한다.
 *
 * @param error 에러
 * @param context 에러 컨텍스트
 * @returns 실행 실패 결과
 */
function toRunFailure(error: unknown, context: MintErrorContext): RunFailure {
  return {
    ok: false,
    error: toMintError(error, context),
  };
}
