import { LexerError } from '@core/lexer/errors.js';
import type {
  LexerErrorCode,
  LexerErrorDetailMap,
  LexerErrorFormatParams,
} from '@core/errors/codes.js';

const MESSAGE_BUILDERS: {
  [K in LexerErrorCode]: (params: LexerErrorFormatParams<K>) => string;
} = {
  LEXER_UNEXPECTED_CHARACTER: ({ position, details }) => {
    const location = `line ${position.line}, column ${position.column}`;
    const char = details?.char ?? '';
    return `${location}: Unexpected character '${char}'.`;
  },
  LEXER_UNTERMINATED_STRING: ({ position }) => {
    const location = `line ${position.line}, column ${position.column}`;
    return `${location}: Unterminated string literal.`;
  },
};

/**
 * 코드와 상세 정보를 바탕으로 렉서 에러 메시지를 생성한다.
 *
 * @param params 에러 코드, 위치, 상세 정보
 * @returns 사용자에게 노출할 문자열 메시지
 */
export function formatLexerErrorMessage<C extends LexerErrorCode>(
  params: LexerErrorFormatParams<C>
): string {
  const builder = MESSAGE_BUILDERS[params.code] as (
    params: LexerErrorFormatParams<C>
  ) => string;

  if (!builder) {
    const { line, column } = params.position;
    return `line ${line}, column ${column}: Unknown lexer error (${params.code}).`;
  }

  return builder(params);
}

/**
 * LexerError 인스턴스를 받아 메시지를 생성한다.
 *
 * @param error 렉서 에러 인스턴스
 * @returns 포맷팅된 문자열 메시지
 */
export function formatLexerError<C extends LexerErrorCode>(
  error: LexerError<C>
): string {
  return formatLexerErrorMessage<C>({
    code: error.code,
    position: error.position,
    lexeme: error.lexeme,
    details: error.details,
  });
}
