import type { ParserState } from '@core/parser/engine/state.js';
import {
  advance,
  checkKeyword,
  checkType,
  peek,
  previous,
} from '@core/parser/engine/state.js';
import type { Token } from '@core/lexer/tokens.js';
import type { IdentifierExpressionNode } from '@core/ast/nodes.js';
import { createParserError } from '@core/errors/factory.js';

/**
 * 식별자 토큰을 소비하고 IdentifierExpression을 생성한다.
 *
 * @param state 파서 상태
 * @param message 실패 시 사용할 에러 메시지(미사용)
 * @returns IdentifierExpression 노드
 */
export function consumeIdentifier(
  state: ParserState,
  _message: string
): IdentifierExpressionNode {
  if (matchType(state, 'IDENTIFIER')) {
    return {
      type: 'IdentifierExpression',
      name: previous(state).lexeme,
    };
  }

  throw createParserError(peek(state), 'PARSER_EXPECTED_TOKEN', {
    expected: 'identifier',
    actual: peek(state).lexeme,
  });
}

/**
 * 현재 토큰이 특정 타입인지 확인하고 소비한다.
 *
 * @param state 파서 상태
 * @param type 기대하는 토큰 타입
 * @param message 에러 메시지(미사용)
 * @returns 소비된 토큰
 */
export function consumeType(
  state: ParserState,
  type: Token['type'],
  _message: string
): Token {
  if (checkType(state, type)) {
    return advance(state);
  }

  throw createParserError(peek(state), 'PARSER_EXPECTED_TOKEN', {
    expected: type,
    actual: peek(state).lexeme,
  });
}

/**
 * 현재 토큰이 특정 키워드인지 확인하고 소비한다.
 *
 * @param state 파서 상태
 * @param keyword 기대하는 키워드
 * @param message 에러 메시지(미사용)
 * @returns 소비된 토큰
 */
export function consumeKeyword(
  state: ParserState,
  keyword: string,
  _message: string
): Token {
  if (checkKeyword(state, keyword)) {
    return advance(state);
  }

  throw createParserError(peek(state), 'PARSER_EXPECTED_TOKEN', {
    expected: keyword,
    actual: peek(state).lexeme,
  });
}

/**
 * 현재 토큰이 특정 타입이면 소비한다.
 *
 * @param state 파서 상태
 * @param type 기대하는 토큰 타입
 * @returns 소비에 성공하면 true
 */
export function matchType(state: ParserState, type: Token['type']): boolean {
  if (checkType(state, type)) {
    advance(state);
    return true;
  }
  return false;
}

/**
 * 현재 토큰이 특정 키워드이면 소비한다.
 *
 * @param state 파서 상태
 * @param keyword 기대하는 키워드
 * @returns 소비에 성공하면 true
 */
export function matchKeyword(state: ParserState, keyword: string): boolean {
  if (checkKeyword(state, keyword)) {
    advance(state);
    return true;
  }
  return false;
}
