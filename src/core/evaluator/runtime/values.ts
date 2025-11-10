import type { FunctionDeclarationNode } from '@core/ast/nodes.js';
import type { Environment } from '@core/evaluator/runtime/environment.js';

export type RuntimeValue = number | string | boolean | null | FunctionValue;

export interface FunctionValue {
  kind: 'Function';
  declaration: FunctionDeclarationNode;
  closure: Environment;
}

/**
 * 값이 사용자 정의 함수인지 판별한다.
 *
 * @param value 검사할 런타임 값
 * @returns 함수 값 여부
 */
export function isFunctionValue(value: RuntimeValue): value is FunctionValue {
  return (
    typeof value === 'object' && value !== null && value.kind === 'Function'
  );
}
