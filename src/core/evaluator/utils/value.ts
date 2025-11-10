import { isFunctionValue } from '@core/evaluator/runtime/values.js';
import type { RuntimeValue } from '@core/evaluator/runtime/values.js';

/**
 * 런타임 값의 truthy/falsy 여부를 반환한다.
 *
 * @param value 검사할 값
 * @returns truthy 여부
 */
export function isTruthy(value: RuntimeValue): boolean {
  return Boolean(value);
}

/**
 * 런타임 값의 타입 문자열을 구한다.
 *
 * @param value 검사할 값
 * @returns 타입 명칭
 */
export function runtimeTypeOf(value: RuntimeValue): string {
  if (value === null) {
    return 'null';
  }

  if (isFunctionValue(value)) {
    return 'function';
  }

  return typeof value;
}

/**
 * 런타임 값을 사용자 친화적인 문자열로 변환한다.
 *
 * @param value 변환할 값
 * @returns 문자열 표현
 */
export function stringify(value: RuntimeValue): string {
  if (value === null) {
    return 'null';
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (typeof value === 'number') {
    return Number.isInteger(value) ? value.toString() : value.toString();
  }

  if (isFunctionValue(value)) {
    const name = value.declaration.name.name ?? '<anonymous>';
    return `<function ${name}>`;
  }
  return value;
}
