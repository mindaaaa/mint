import type { SourcePosition } from '@core/lexer/tokens.js';
import type {
  ParserErrorCode,
  ParserErrorDetailMap,
} from '@core/errors/codes.js';

interface ParserErrorOptions<C extends ParserErrorCode> {
  code: C;
  message: string;
  position: SourcePosition;
  lexeme?: string;
  details: ParserErrorDetailMap[C];
}

export class ParserError<
  C extends ParserErrorCode = ParserErrorCode
> extends Error {
  public readonly code: C;
  public readonly position: SourcePosition;
  public readonly lexeme?: string;
  public readonly details: ParserErrorDetailMap[C];

  /**
   * 파서 단계에서 발생한 에러를 표현한다.
   *
   * @param options 에러 코드, 메시지, 위치, 추가 정보
   */
  constructor(options: ParserErrorOptions<C>) {
    super(options.message);
    this.name = 'ParserError';
    this.code = options.code;
    this.position = options.position;
    this.lexeme = options.lexeme;
    this.details = options.details;
  }
}
