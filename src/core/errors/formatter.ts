import { LexerError } from '@core/lexer/errors.js';
import { ParserError } from '@core/parser/errors.js';
import type {
  LexerErrorCode,
  LexerErrorFormatParams,
  ParserErrorCode,
  ParserErrorFormatParams,
} from '@core/errors/codes.js';

/**
 * 렉서 에러 메시지 생성 함수 맵
 */
const LEXER_MESSAGE_BUILDERS: {
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
 * 파서 에러 메시지 생성 함수 맵
 */
const PARSER_MESSAGE_BUILDERS: {
  [K in ParserErrorCode]: (params: ParserErrorFormatParams<K>) => string;
} = {
  PARSER_UNEXPECTED_TOKEN: ({ position, details }) => {
    const location = `line ${position.line}, column ${position.column}`;
    const actual = details?.actual ?? 'unknown';
    const expected = details?.expected;
    if (expected) {
      return `${location}: Unexpected token '${actual}', expected '${expected}'.`;
    }
    return `${location}: Unexpected token '${actual}'.`;
  },
  PARSER_EXPECTED_TOKEN: ({ position, details }) => {
    const location = `line ${position.line}, column ${position.column}`;
    const expected = details?.expected ?? 'unknown';
    const actual = details?.actual ?? 'unknown';
    return `${location}: Expected '${expected}' but found '${actual}'.`;
  },
};

/**
 * 코드와 상세 정보를 바탕으로 렉서 에러 메시지를 생성한다.
 *
 * @param params 에러 포맷 파라미터
 * @returns 생성된 렉서 에러 메시지
 */
export function formatLexerErrorMessage<C extends LexerErrorCode>(
  params: LexerErrorFormatParams<C>
): string {
  const builder = LEXER_MESSAGE_BUILDERS[params.code] as (
    params: LexerErrorFormatParams<C>
  ) => string;

  if (!builder) {
    const { line, column } = params.position;
    return `line ${line}, column ${column}: Unknown lexer error (${params.code}).`;
  }

  return builder(params);
}

/**
 * 코드와 상세 정보를 바탕으로 파서 에러 메시지를 생성한다.
 *
 * @param params 에러 포맷 파라미터
 * @returns 생성된 파서 에러 메시지
 */
export function formatParserErrorMessage<C extends ParserErrorCode>(
  params: ParserErrorFormatParams<C>
): string {
  const builder = PARSER_MESSAGE_BUILDERS[params.code] as (
    params: ParserErrorFormatParams<C>
  ) => string;

  if (!builder) {
    const { line, column } = params.position;
    return `line ${line}, column ${column}: Unknown parser error (${params.code}).`;
  }

  return builder(params);
}

/**
 * LexerError 인스턴스를 받아 메시지를 생성한다.
 *
 * @param error LexerError 인스턴스
 * @returns 생성된 LexerError 메시지
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

/**
 * ParserError 인스턴스를 받아 메시지를 생성한다.
 *
 * @param error ParserError 인스턴스
 * @returns 생성된 ParserError 메시지
 */
export function formatParserError<C extends ParserErrorCode>(
  error: ParserError<C>
): string {
  return formatParserErrorMessage<C>({
    code: error.code,
    position: error.position,
    lexeme: error.lexeme,
    details: error.details,
  });
}
