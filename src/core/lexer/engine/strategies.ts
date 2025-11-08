import {
  advance,
  addToken,
  currentLexeme,
  isAtEnd,
  match,
  newLine,
  peek,
  peekNext,
  sliceSource,
  type LexerState,
} from '@core/lexer/engine/state.js';
import { KEYWORDS, type TokenType } from '@core/lexer/tokens.js';
import { createLexerError } from '@core/errors/factory.js';

type TokenRule = (state: LexerState) => boolean;

/**
 * 공백 문자(스페이스, 탭 등)를 건너뛰는 규칙.
 *
 * @param state 렉서 상태
 * @returns 공백을 처리했으면 true
 */
const whitespaceRule: TokenRule = (state) => {
  const char = peek(state);
  if (char === ' ' || char === '\r' || char === '\t') {
    advance(state);
    return true;
  }
  return false;
};

/**
 * 개행 문자를 처리해 line/column을 갱신하는 규칙.
 *
 * @param state 렉서 상태
 * @returns 개행을 처리했으면 true
 */
const newlineRule: TokenRule = (state) => {
  if (peek(state) === '\n') {
    advance(state);
    newLine(state);
    return true;
  }
  return false;
};

/**
 * 한 줄 주석(//)을 건너뛰는 규칙.
 *
 * @param state 렉서 상태
 * @returns 주석을 처리했으면 true
 */
const commentRule: TokenRule = (state) => {
  if (peek(state) === '/' && peekNext(state) === '/') {
    advance(state);
    advance(state);

    while (peek(state) !== '\n' && !isAtEnd(state)) {
      advance(state);
    }
    return true;
  }
  return false;
};

/**
 * 문자열 리터럴을 스캔해 토큰으로 추가하는 규칙.
 *
 * @param state 렉서 상태
 * @returns 문자열을 처리했으면 true
 */
const stringRule: TokenRule = (state) => {
  if (peek(state) !== '"') {
    return false;
  }

  advance(state);

  while (peek(state) !== '"' && !isAtEnd(state)) {
    if (peek(state) === '\n') {
      advance(state);
      newLine(state);
      continue;
    }
    advance(state);
  }

  if (isAtEnd(state)) {
    throw createLexerError(state, 'LEXER_UNTERMINATED_STRING', undefined);
  }

  advance(state);

  const literal = sliceSource(state, state.start + 1, state.current - 1);
  addToken(state, 'STRING', literal);
  return true;
};

/**
 * 숫자 리터럴(정수/소수)을 스캔하는 규칙.
 *
 * @param state 렉서 상태
 * @returns 숫자를 처리했으면 true
 */
const numberRule: TokenRule = (state) => {
  if (!isDigit(peek(state))) {
    return false;
  }

  while (isDigit(peek(state))) {
    advance(state);
  }

  if (peek(state) === '.' && isDigit(peekNext(state))) {
    advance(state);
    while (isDigit(peek(state))) {
      advance(state);
    }
  }

  const value = Number(currentLexeme(state));
  addToken(state, 'NUMBER', value);
  return true;
};

/**
 * 식별자/키워드를 스캔해 적절한 토큰으로 추가하는 규칙.
 *
 * @param state 렉서 상태
 * @returns 식별자/키워드를 처리했으면 true
 */
const identifierRule: TokenRule = (state) => {
  if (!isAlpha(peek(state))) {
    return false;
  }

  while (isAlphaNumeric(peek(state))) {
    advance(state);
  }

  const text = currentLexeme(state);
  const keyword = KEYWORDS[text] ?? null;

  if (keyword) {
    addToken(state, 'KEYWORD', undefined, keyword);
  } else {
    addToken(state, 'IDENTIFIER');
  }

  return true;
};

/**
 * 1글자 또는 2글자 연산자를 처리하는 규칙 (=, == 등).
 *
 * @param state 렉서 상태
 * @returns 연산자를 처리했으면 true
 */
const operatorRule: TokenRule = (state) => {
  const operator = OPERATOR_TOKENS[peek(state)];
  if (!operator) {
    return false;
  }

  advance(state);
  if (operator.double && match(state, '=')) {
    addToken(state, operator.double);
  } else {
    addToken(state, operator.single);
  }

  return true;
};

/**
 * 단일 문자 토큰(괄호, 세미콜론 등)을 처리하는 규칙.
 *
 * @param state 렉서 상태
 * @returns 단일 문자 토큰을 처리했으면 true
 */
const singleCharRule: TokenRule = (state) => {
  const tokenType = SINGLE_CHAR_TOKENS[peek(state)];
  if (!tokenType) {
    return false;
  }

  advance(state);
  addToken(state, tokenType);
  return true;
};

/**
 * 등록된 모든 규칙을 순차적으로 적용하기 위한 파이프라인.
 */
export const TOKEN_RULES: TokenRule[] = [
  whitespaceRule,
  newlineRule,
  commentRule,
  stringRule,
  numberRule,
  identifierRule,
  operatorRule,
  singleCharRule,
];

/**
 * 단일 문자 토큰에 대한 매핑.
 */
const SINGLE_CHAR_TOKENS: Record<string, TokenType> = {
  '(': 'LEFT_PAREN',
  ')': 'RIGHT_PAREN',
  '{': 'LEFT_BRACE',
  '}': 'RIGHT_BRACE',
  ',': 'COMMA',
  '.': 'DOT',
  '-': 'MINUS',
  '+': 'PLUS',
  ';': 'SEMICOLON',
  '*': 'STAR',
  '/': 'SLASH',
};

/**
 * 1글자/2글자 연산자 토큰에 대한 매핑.
 */
const OPERATOR_TOKENS: Record<
  string,
  { single: TokenType; double?: TokenType }
> = {
  '!': { single: 'BANG', double: 'BANG_EQUAL' },
  '=': { single: 'EQUAL', double: 'EQUAL_EQUAL' },
  '<': { single: 'LESS', double: 'LESS_EQUAL' },
  '>': { single: 'GREATER', double: 'GREATER_EQUAL' },
};

/**
 * 숫자 여부를 판별한다.
 *
 * @param char 검사할 문자
 * @returns 숫자면 true
 */
function isDigit(char: string): boolean {
  return char >= '0' && char <= '9';
}

/**
 * 알파벳 또는 밑줄 여부를 판별한다.
 *
 * @param char 검사할 문자
 * @returns 알파벳/밑줄이면 true
 */
function isAlpha(char: string): boolean {
  return (
    (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_'
  );
}

/**
 * 알파벳 또는 숫자 여부를 판별한다.
 *
 * @param char 검사할 문자
 * @returns 알파벳/숫자면 true
 */
function isAlphaNumeric(char: string): boolean {
  return isAlpha(char) || isDigit(char);
}
