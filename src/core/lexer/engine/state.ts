import type {
  KeywordType,
  SourcePosition,
  Token,
  TokenType,
} from '@core/lexer/tokens.js';

export interface LexerState {
  source: string;
  tokens: Token[];
  start: number;
  current: number;
  line: number;
  column: number;
}

/**
 * 주어진 소스 문자열을 토대로 초기 렉서 상태를 생성한다.
 *
 * @param source 토큰화할 원본 소스
 * @returns 초기화된 렉서 상태
 */
export function createInitialState(source: string): LexerState {
  return {
    source,
    tokens: [],
    start: 0,
    current: 0,
    line: 1,
    column: 1,
  };
}

/**
 * 현재 토큰의 시작 지점을 표시한다.
 *
 * @param state 렉서 상태
 */
export function markTokenStart(state: LexerState): void {
  state.start = state.current;
}

/**
 * 입력이 끝에 도달했는지 여부를 판단한다.
 *
 * @param state 렉서 상태
 * @returns 입력이 종료되었으면 true
 */
export function isAtEnd(state: LexerState): boolean {
  return state.current >= state.source.length;
}

/**
 * 현재 위치의 문자를 소비하고 반환한다.
 *
 * @param state 렉서 상태
 * @returns 소비된 문자
 */
export function advance(state: LexerState): string {
  const char = state.source[state.current] ?? '\0';
  state.current += 1;
  state.column += 1;
  return char;
}

/**
 * 줄바꿈을 처리해 line/column 정보를 갱신한다.
 *
 * @param state 렉서 상태
 */
export function newLine(state: LexerState): void {
  state.line += 1;
  state.column = 1;
}

/**
 * 현재 문자를 들여다본다.
 *
 * @param state 렉서 상태
 * @returns 현재 문자 또는 널 문자
 */
export function peek(state: LexerState): string {
  if (isAtEnd(state)) {
    return '\0';
  }
  return state.source[state.current] ?? '\0';
}

/**
 * 다음 문자를 들여다본다.
 *
 * @param state 렉서 상태
 * @returns 다음 문자 또는 널 문자
 */
export function peekNext(state: LexerState): string {
  if (state.current + 1 >= state.source.length) {
    return '\0';
  }
  return state.source[state.current + 1] ?? '\0';
}

/**
 * 기대한 문자가 이어지는지 검사하고, 맞다면 소비한다.
 *
 * @param state 렉서 상태
 * @param expected 비교할 문자
 * @returns 문자를 소비했으면 true
 */
export function match(state: LexerState, expected: string): boolean {
  if (isAtEnd(state)) {
    return false;
  }
  if (state.source[state.current] !== expected) {
    return false;
  }
  state.current += 1;
  state.column += 1;
  return true;
}

/**
 * 새 토큰을 생성해 상태에 추가한다.
 *
 * @param state 렉서 상태
 * @param type 토큰 타입
 * @param literal 토큰 리터럴 값
 * @param keyword 키워드 토큰의 경우 해당 키워드
 */
export function addToken(
  state: LexerState,
  type: TokenType,
  literal?: string | number | boolean | null,
  keyword?: KeywordType
): void {
  state.tokens.push(
    buildToken(state, {
      type,
      lexeme: state.source.slice(state.start, state.current),
      literal,
      keyword,
    })
  );
}

/**
 * 현재 토큰에 해당하는 원본 문자열을 반환한다.
 *
 * @param state 렉서 상태
 * @returns 현재 토큰의 lexeme
 */
export function currentLexeme(state: LexerState): string {
  return state.source.slice(state.start, state.current);
}

/**
 * 소스 문자열의 특정 구간을 잘라 반환한다.
 *
 * @param state 렉서 상태
 * @param start 시작 인덱스
 * @param end 종료 인덱스
 * @returns 잘라낸 부분 문자열
 */
export function sliceSource(
  state: LexerState,
  start: number,
  end: number
): string {
  return state.source.slice(start, end);
}

/**
 * 토큰 정보를 기반으로 Token 객체를 생성한다.
 *
 * @param state 렉서 상태
 * @param token 생성할 토큰 정보
 * @returns Token 객체
 */
function buildToken(
  state: LexerState,
  token: {
    type: TokenType;
    lexeme: string;
    literal?: string | number | boolean | null;
    keyword?: KeywordType;
  }
): Token {
  return {
    ...token,
    position: currentPosition(state),
  };
}

/**
 * 현재 토큰이 시작된 위치(line/column)을 계산한다.
 *
 * @param state 렉서 상태
 * @returns 토큰 시작 위치
 */
function currentPosition(state: LexerState): SourcePosition {
  return {
    line: state.line,
    column: state.column - (state.current - state.start),
  };
}
