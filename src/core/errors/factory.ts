import type { LexerState } from '@core/lexer/engine/state.js';
import { LexerError } from '@core/lexer/errors/errors.js';
import type {
  LexerErrorCode,
  LexerErrorDetailMap,
  ParserErrorCode,
  ParserErrorDetailMap,
  EvaluatorErrorCode,
  EvaluatorErrorDetailMap,
} from '@core/errors/codes.js';
import {
  formatLexerErrorMessage,
  formatParserErrorMessage,
  formatEvaluatorErrorMessage,
} from '@core/errors/formatter.js';
import type { Token } from '@core/lexer/tokens.js';
import { ParserError } from '@core/parser/errors/errors.js';
import { EvaluatorError } from '@core/evaluator/errors/errors.js';

/**
 * 렉서 상태와 에러 코드를 기반으로 표준화된 LexerError를 생성한다.
 *
 * @param state 렉서 상태
 * @param code 에러 코드
 * @param details 에러 코드별 상세 정보
 * @returns 생성된 LexerError 인스턴스
 */
export function createLexerError<C extends LexerErrorCode>(
  state: LexerState,
  code: C,
  details: LexerErrorDetailMap[C]
): LexerError<C> {
  const position = { line: state.line, column: state.column };
  const lexeme = state.source.slice(state.start, state.current) || undefined;

  const message = formatLexerErrorMessage<C>({
    code,
    position,
    lexeme,
    details,
  });

  return new LexerError<C>({
    code,
    message,
    position,
    lexeme,
    details,
  });
}

/**
 * 토큰과 에러 코드를 기반으로 표준화된 ParserError를 생성한다.
 *
 * @param token 에러가 발생한 토큰
 * @param code 에러 코드
 * @param details 에러 코드별 상세 정보
 * @returns 생성된 ParserError 인스턴스
 */
export function createParserError<C extends ParserErrorCode>(
  token: Token,
  code: C,
  details: ParserErrorDetailMap[C]
): ParserError<C> {
  const position = token.position;
  const lexeme = token.lexeme || undefined;

  const message = formatParserErrorMessage<C>({
    code,
    position,
    lexeme,
    details,
  });

  return new ParserError<C>({
    code,
    message,
    position,
    lexeme,
    details,
  });
}

/**
 * 평가 단계에서 발생한 오류에 대한 EvaluatorError를 생성한다.
 *
 * @param code 에러 코드
 * @param details 에러 코드별 상세 정보
 * @returns 생성된 EvaluatorError 인스턴스
 */
export function createEvaluatorError<C extends EvaluatorErrorCode>(
  code: C,
  details: EvaluatorErrorDetailMap[C]
): EvaluatorError<C> {
  const message = formatEvaluatorErrorMessage<C>({
    code,
    details,
  });

  return new EvaluatorError<C>({
    code,
    message,
    details,
  });
}
