import { createInitialState } from '@core/lexer/engine/state.js';
import { createLexerError } from '@core/errors/factory.js';
import { formatLexerError } from '@core/errors/formatter.js';
import { LexerError } from '@core/lexer/errors.js';

function makeStateFromSource(
  source: string,
  current = 0,
  line = 1,
  column = 1
) {
  const state = createInitialState(source);
  state.current = current;
  state.line = line;
  state.column = column;
  return state;
}

describe('LexerError factory & formatter', () => {
  test('createLexerError는 코드와 상세정보를 유지한다', () => {
    // Given
    const state = makeStateFromSource('foo$bar', 4, 1, 5);

    // When
    const error = createLexerError(state, 'LEXER_UNEXPECTED_CHARACTER', {
      char: '$',
    });

    // Then
    expect(error).toBeInstanceOf(LexerError);
    expect(error.code).toBe('LEXER_UNEXPECTED_CHARACTER');
    expect(error.details).toEqual({ char: '$' });
    expect(error.position).toEqual({ line: 1, column: 5 });
  });

  test('formatLexerError는 일관된 메시지를 반환한다', () => {
    // Given
    const state = makeStateFromSource('"hello', 6, 1, 6);

    // When
    const error = createLexerError(
      state,
      'LEXER_UNTERMINATED_STRING',
      undefined
    );
    const message = formatLexerError(error);

    // Then
    expect(message).toContain('line 1, column 6');
    expect(message).toContain('Unterminated string literal');
  });
});
