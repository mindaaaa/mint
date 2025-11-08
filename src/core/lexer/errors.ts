import type { SourcePosition } from '@core/lexer/tokens.js';
import type {
  LexerErrorCode,
  LexerErrorDetailMap,
} from '@core/errors/codes.js';

interface LexerErrorOptions<C extends LexerErrorCode> {
  code: C;
  message: string;
  position: SourcePosition;
  lexeme?: string;
  details: LexerErrorDetailMap[C];
}

export class LexerError<
  C extends LexerErrorCode = LexerErrorCode
> extends Error {
  public readonly code: C;
  public readonly position: SourcePosition;
  public readonly lexeme?: string;
  public readonly details: LexerErrorDetailMap[C];

  /**
   * 렉서 단계에서 발생한 에러 정보를 표현한다.
   *
   * @param options 에러 코드, 메시지, 위치, 추가 정보
   */
  constructor(options: LexerErrorOptions<C>) {
    super(options.message);
    this.name = 'LexerError';
    this.code = options.code;
    this.position = options.position;
    this.lexeme = options.lexeme;
    this.details = options.details;
  }
}
