import type {
  EvaluatorErrorCode,
  EvaluatorErrorDetailMap,
} from '@core/errors/codes.js';

interface EvaluatorErrorOptions<C extends EvaluatorErrorCode> {
  code: C;
  message: string;
  details: EvaluatorErrorDetailMap[C];
}

export class EvaluatorError<
  C extends EvaluatorErrorCode = EvaluatorErrorCode
> extends Error {
  public readonly code: C;
  public readonly details: EvaluatorErrorDetailMap[C];

  /**
   * 평가 단계에서 발생한 런타임 에러를 표현한다.
   *
   * @param options 에러 코드와 메시지, 상세 정보
   */
  constructor(options: EvaluatorErrorOptions<C>) {
    super(options.message);
    this.name = 'EvaluatorError';
    this.code = options.code;
    this.details = options.details;
  }
}
