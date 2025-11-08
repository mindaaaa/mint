import {
  addToken,
  advance,
  createInitialState,
  isAtEnd,
  markTokenStart,
  type LexerState,
} from '@core/lexer/engine/state.js';
import { TOKEN_RULES } from '@core/lexer/engine/strategies.js';
import { createLexerError } from '@core/errors/factory.js';
import type { Token } from '@core/lexer/tokens.js';

/**
 * 주어진 소스 코드를 토큰 배열로 변환한다.
 *
 * @param source 토큰화할 원본 소스 코드
 * @returns 토큰 배열
 * @example
 * ```ts
 * const tokens = tokenize('plant seed = 1');
 * console.log(tokens[0].keyword); // 'plant'
 * ```
 */
export function tokenize(source: string): Token[] {
  const state = createInitialState(source);

  while (!isAtEnd(state)) {
    markTokenStart(state);
    const handled = scanToken(state);

    if (!handled) {
      const char = advance(state);
      throw createLexerError(state, 'LEXER_UNEXPECTED_CHARACTER', { char });
    }
  }

  markTokenStart(state);
  addToken(state, 'EOF');

  return state.tokens;
}

/**
 * 주어진 상태에 대해 토큰 규칙을 순차적으로 적용하여 토큰을 생성한다.
 * @param state 상태
 * @returns 토큰을 생성했으면 true, 그렇지 않으면 false
 */
function scanToken(state: LexerState): boolean {
  for (const rule of TOKEN_RULES) {
    if (rule(state)) {
      return true;
    }
  }

  return false;
}
