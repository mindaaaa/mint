import type { Token } from '@core/lexer/tokens.js';

export interface ParserState {
  tokens: Token[];
  current: number;
}

/**
 * 파서가 토큰 시퀀스를 순회할 때 사용할 초기 상태를 생성한다.
 *
 * @param tokens 토큰 배열
 * @returns 초기화된 파서 상태
 */
export function createParserState(tokens: Token[]): ParserState {
  return { tokens, current: 0 };
}

/**
 * 현재 토큰을 반환하고, 파서가 끝에 도달했는지 여부를 확인한다.
 *
 * @param state 파서 상태
 * @returns 파서가 EOF 토큰을 가리키면 true
 */
export function isAtEnd(state: ParserState): boolean {
  return peek(state).type === 'EOF';
}

/**
 * 다음 토큰으로 이동하고, 이동 전 토큰을 반환한다.
 *
 * @param state 파서 상태
 * @returns 이동 전에 가리키던 토큰
 */
export function advance(state: ParserState): Token {
  if (!isAtEnd(state)) {
    state.current += 1;
  }
  return previous(state);
}

/**
 * 현재 토큰을 반환한다.
 *
 * @param state 파서 상태
 * @returns 현재 토큰
 */
export function peek(state: ParserState): Token {
  return state.tokens[state.current];
}

/**
 * 마지막으로 소비한 토큰을 반환한다.
 *
 * @param state 파서 상태
 * @returns 이전 토큰
 */
export function previous(state: ParserState): Token {
  return state.tokens[state.current - 1];
}

/**
 * 현재 토큰이 기대한 타입인지 확인한다.
 *
 * @param state 파서 상태
 * @param type 기대하는 토큰 타입
 * @returns 타입이 일치하면 true
 */
export function checkType(state: ParserState, type: Token['type']): boolean {
  if (isAtEnd(state)) return false;
  return peek(state).type === type;
}

/**
 * 현재 토큰이 특정 키워드인지 확인한다.
 *
 * @param state 파서 상태
 * @param keyword 기대하는 키워드 문자열
 * @returns 키워드가 일치하면 true
 */
export function checkKeyword(state: ParserState, keyword: string): boolean {
  if (isAtEnd(state)) return false;
  const token = peek(state);
  return token.type === 'KEYWORD' && token.keyword === keyword;
}
