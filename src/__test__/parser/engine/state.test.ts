import {
  advance,
  checkKeyword,
  checkType,
  createParserState,
  isAtEnd,
  peek,
  previous,
  type ParserState,
} from '@core/parser/engine/state.js';
import type { Token } from '@core/lexer/tokens.js';

describe('parser engine state', () => {
  describe('createParserState', () => {
    test('초기 상태를 올바르게 생성한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'IDENTIFIER', lexeme: 'x', position: { line: 1, column: 1 } },
        { type: 'EQUAL', lexeme: '=', position: { line: 1, column: 3 } },
        { type: 'NUMBER', lexeme: '1', literal: 1, position: { line: 1, column: 5 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 6 } },
      ];

      // When
      const state = createParserState(tokens);

      // Then
      expect(state.tokens).toBe(tokens);
      expect(state.current).toBe(0);
    });

    test('빈 토큰 배열로도 초기 상태를 생성할 수 있다', () => {
      // Given
      const tokens: Token[] = [];

      // When
      const state = createParserState(tokens);

      // Then
      expect(state.tokens).toBe(tokens);
      expect(state.current).toBe(0);
    });
  });

  describe('peek', () => {
    test('현재 토큰을 반환한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'IDENTIFIER', lexeme: 'x', position: { line: 1, column: 1 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 2 } },
      ];
      const state = createParserState(tokens);

      // When
      const token = peek(state);

      // Then
      expect(token).toBe(tokens[0]);
      expect(token.type).toBe('IDENTIFIER');
      expect(state.current).toBe(0); // 위치는 변경되지 않음
    });

    test('EOF 토큰을 반환한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'EOF', lexeme: '', position: { line: 1, column: 1 } },
      ];
      const state = createParserState(tokens);

      // When
      const token = peek(state);

      // Then
      expect(token.type).toBe('EOF');
    });
  });

  describe('previous', () => {
    test('이전 토큰을 반환한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'IDENTIFIER', lexeme: 'x', position: { line: 1, column: 1 } },
        { type: 'EQUAL', lexeme: '=', position: { line: 1, column: 3 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 4 } },
      ];
      const state = createParserState(tokens);
      state.current = 1;

      // When
      const token = previous(state);

      // Then
      expect(token).toBe(tokens[0]);
      expect(token.type).toBe('IDENTIFIER');
    });
  });

  describe('isAtEnd', () => {
    test('EOF 토큰에 도달했을 때 true를 반환한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'IDENTIFIER', lexeme: 'x', position: { line: 1, column: 1 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 2 } },
      ];
      const state = createParserState(tokens);
      state.current = 1;

      // When
      const result = isAtEnd(state);

      // Then
      expect(result).toBe(true);
    });

    test('EOF 토큰이 아닐 때 false를 반환한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'IDENTIFIER', lexeme: 'x', position: { line: 1, column: 1 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 2 } },
      ];
      const state = createParserState(tokens);
      state.current = 0;

      // When
      const result = isAtEnd(state);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('advance', () => {
    test('다음 토큰으로 이동하고 이전 토큰을 반환한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'IDENTIFIER', lexeme: 'x', position: { line: 1, column: 1 } },
        { type: 'EQUAL', lexeme: '=', position: { line: 1, column: 3 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 4 } },
      ];
      const state = createParserState(tokens);
      state.current = 0;

      // When
      const token = advance(state);

      // Then
      expect(token).toBe(tokens[0]);
      expect(state.current).toBe(1);
    });

    test('EOF에 도달하면 더 이상 진행하지 않는다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'IDENTIFIER', lexeme: 'x', position: { line: 1, column: 1 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 2 } },
      ];
      const state = createParserState(tokens);
      state.current = 1; // EOF 위치

      // When
      const token = advance(state);

      // Then
      // advance는 previous()를 반환하므로, current가 1일 때 previous는 tokens[0]을 반환
      expect(token).toBe(tokens[0]); // 이전 토큰 반환
      expect(state.current).toBe(1); // 위치는 변경되지 않음 (EOF이므로)
    });
  });

  describe('checkType', () => {
    test('현재 토큰 타입이 일치하면 true를 반환한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'IDENTIFIER', lexeme: 'x', position: { line: 1, column: 1 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 2 } },
      ];
      const state = createParserState(tokens);

      // When
      const result = checkType(state, 'IDENTIFIER');

      // Then
      expect(result).toBe(true);
    });

    test('현재 토큰 타입이 일치하지 않으면 false를 반환한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'IDENTIFIER', lexeme: 'x', position: { line: 1, column: 1 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 2 } },
      ];
      const state = createParserState(tokens);

      // When
      const result = checkType(state, 'NUMBER');

      // Then
      expect(result).toBe(false);
    });

    test('EOF에 도달하면 false를 반환한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'EOF', lexeme: '', position: { line: 1, column: 1 } },
      ];
      const state = createParserState(tokens);

      // When
      const result = checkType(state, 'IDENTIFIER');

      // Then
      expect(result).toBe(false);
    });
  });

  describe('checkKeyword', () => {
    test('현재 토큰이 키워드이고 일치하면 true를 반환한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'KEYWORD',
          keyword: 'plant',
          lexeme: 'plant',
          position: { line: 1, column: 1 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 6 } },
      ];
      const state = createParserState(tokens);

      // When
      const result = checkKeyword(state, 'plant');

      // Then
      expect(result).toBe(true);
    });

    test('현재 토큰이 키워드이지만 일치하지 않으면 false를 반환한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'KEYWORD',
          keyword: 'plant',
          lexeme: 'plant',
          position: { line: 1, column: 1 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 6 } },
      ];
      const state = createParserState(tokens);

      // When
      const result = checkKeyword(state, 'petal');

      // Then
      expect(result).toBe(false);
    });

    test('현재 토큰이 키워드가 아니면 false를 반환한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'IDENTIFIER', lexeme: 'x', position: { line: 1, column: 1 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 2 } },
      ];
      const state = createParserState(tokens);

      // When
      const result = checkKeyword(state, 'plant');

      // Then
      expect(result).toBe(false);
    });

    test('EOF에 도달하면 false를 반환한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'EOF', lexeme: '', position: { line: 1, column: 1 } },
      ];
      const state = createParserState(tokens);

      // When
      const result = checkKeyword(state, 'plant');

      // Then
      expect(result).toBe(false);
    });
  });
});

