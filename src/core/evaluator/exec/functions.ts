import type {
  FunctionValue,
  RuntimeValue,
} from '@core/evaluator/runtime/values.js';
import type { BlockExecutor } from './types.js';

/**
 * 함수 선언을 호출 가능한 런타임 함수로 실행하는 헬퍼.
 * @example
 * ```ts
 * const executor = new FunctionExecutor();
 * executor.setBlockExecutor((block, environment, context) => {
 *   return block(environment, context);
 * });
 * const functionValue = executor.callFunction(functionValue, [1, 2, 3]);
 * ```
 */
export class FunctionExecutor {
  private executeBlockFn?: BlockExecutor;

  /**
   * 함수 본문을 실행할 블록 실행기 콜백을 설정한다.
   *
   * @param executor 블록 실행 함수
   */
  setBlockExecutor(executor: BlockExecutor): void {
    this.executeBlockFn = executor;
  }

  /**
   * 함수 런타임 값을 호출하여 결과를 반환한다.
   *
   * @param fn 호출할 함수 값
   * @param args 인수 목록
   * @returns 함수 실행 결과
   */
  callFunction(fn: FunctionValue, args: RuntimeValue[]): RuntimeValue {
    if (!this.executeBlockFn) {
      throw new Error('FunctionExecutor에 블록 실행기가 설정되지 않았습니다.');
    }
    const localEnv = fn.closure.createChild();

    fn.declaration.params.forEach((param, index) => {
      localEnv.declare(param.name, args[index]);
    });

    const signal = this.executeBlockFn(fn.declaration.body, localEnv, {
      inFunction: true,
    });

    if (signal?.type === 'return') {
      return signal.value ?? null;
    }

    return null;
  }
}
