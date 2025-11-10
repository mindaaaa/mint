import { createEvaluatorError } from '@core/errors/factory.js';
import type { RuntimeValue } from '@core/evaluator/runtime/values.js';

export class Environment {
  private readonly values = new Map<string, RuntimeValue>();

  constructor(private readonly parent?: Environment) {}

  /**
   * 식별자를 현재 또는 상위 스코프에 선언한다.
   *
   * @param name 식별자 이름
   * @param value 저장할 값
   * @returns 저장된 값
   */
  declare(name: string, value: RuntimeValue): RuntimeValue {
    const target = this.resolve(name);

    if (target) {
      target.values.set(name, value);
      return value;
    }
    this.values.set(name, value);
    return value;
  }

  /**
   * 기존에 선언된 식별자에 값을 대입한다.
   *
   * @param name 식별자 이름
   * @param value 대입할 값
   * @returns 대입된 값
   */
  assign(name: string, value: RuntimeValue): RuntimeValue {
    const target = this.resolve(name);

    if (!target) {
      throw createEvaluatorError('EVALUATOR_INVALID_ASSIGNMENT_TARGET', {
        name,
      });
    }

    target.values.set(name, value);
    return value;
  }

  /**
   * 식별자 값을 조회한다.
   *
   * @param name 식별자 이름
   * @returns 저장된 값
   */
  get(name: string): RuntimeValue {
    const target = this.resolve(name);

    if (!target) {
      throw createEvaluatorError('EVALUATOR_UNDEFINED_IDENTIFIER', { name });
    }
    return target.values.get(name)!;
  }

  /**
   * 현재 환경을 부모로 하는 자식 환경을 생성한다.
   *
   * @returns 새 자식 환경
   */
  createChild(): Environment {
    return new Environment(this);
  }

  /**
   * 식별자를 현재 또는 상위 스코프에서 검색한다.
   *
   * @param name 식별자 이름
   * @returns 찾은 환경 또는 상위 환경
   */
  private resolve(name: string): Environment | undefined {
    if (this.values.has(name)) {
      return this;
    }
    return this.parent?.resolve(name);
  }
}
