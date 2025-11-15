import {
  consumeIdentifier,
  consumeKeyword,
  consumeType,
  matchKeyword,
  matchType,
} from '@core/parser/engine/helpers.js';
import { createParserState } from '@core/parser/engine/state.js';
import { ParserError } from '@core/parser/errors/errors.js';
import type { Token } from '@core/lexer/tokens.js';

describe('parser engine helpers', () => {
  describe('consumeIdentifier', () => {
    test('식별자 토큰을 소비하고 IdentifierExpression을 반환한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'IDENTIFIER', lexeme: 'x', position: { line: 1, column: 1 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 2 } },
      ];
      const state = createParserState(tokens);

      // When
      const identifier = consumeIdentifier(state, 'Expected identifier');

      // Then
      expect(identifier).toEqual({
        type: 'IdentifierExpression',
        name: 'x',
      });
      expect(state.current).toBe(1);
    });

    test('식별자가 아닌 토큰이면 ParserError를 발생시킨다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'NUMBER',
          lexeme: '1',
          literal: 1,
          position: { line: 1, column: 1 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 2 } },
      ];
      const state = createParserState(tokens);

      // When
      const when = () => consumeIdentifier(state, 'Expected identifier');

      // Then
      expect(when).toThrow(ParserError);
      try {
        consumeIdentifier(state, 'Expected identifier');
      } catch (error) {
        expect(error).toBeInstanceOf(ParserError);
        if (error instanceof ParserError) {
          expect(error.code).toBe('PARSER_EXPECTED_TOKEN');
        }
      }
    });
  });

  describe('consumeType', () => {
    test('기대한 타입의 토큰을 소비하고 반환한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'LEFT_PAREN', lexeme: '(', position: { line: 1, column: 1 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 2 } },
      ];
      const state = createParserState(tokens);

      // When
      const token = consumeType(state, 'LEFT_PAREN', 'Expected "("');

      // Then
      expect(token.type).toBe('LEFT_PAREN');
      expect(state.current).toBe(1);
    });

    test('기대한 타입이 아니면 ParserError를 발생시킨다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'RIGHT_PAREN', lexeme: ')', position: { line: 1, column: 1 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 2 } },
      ];
      const state = createParserState(tokens);

      // When
      const when = () => consumeType(state, 'LEFT_PAREN', 'Expected "("');

      // Then
      expect(when).toThrow(ParserError);
      try {
        consumeType(state, 'LEFT_PAREN', 'Expected "("');
      } catch (error) {
        expect(error).toBeInstanceOf(ParserError);
        if (error instanceof ParserError) {
          expect(error.code).toBe('PARSER_EXPECTED_TOKEN');
        }
      }
    });
  });

  describe('consumeKeyword', () => {
    test('기대한 키워드를 소비하고 반환한다', () => {
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
      const token = consumeKeyword(state, 'plant', 'Expected "plant"');

      // Then
      expect(token.type).toBe('KEYWORD');
      expect(token.keyword).toBe('plant');
      expect(state.current).toBe(1);
    });

    test('기대한 키워드가 아니면 ParserError를 발생시킨다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'KEYWORD',
          keyword: 'petal',
          lexeme: 'petal',
          position: { line: 1, column: 1 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 6 } },
      ];
      const state = createParserState(tokens);

      // When
      const when = () => consumeKeyword(state, 'plant', 'Expected "plant"');

      // Then
      expect(when).toThrow(ParserError);
      try {
        consumeKeyword(state, 'plant', 'Expected "plant"');
      } catch (error) {
        expect(error).toBeInstanceOf(ParserError);
        if (error instanceof ParserError) {
          expect(error.code).toBe('PARSER_EXPECTED_TOKEN');
        }
      }
    });

    test('키워드가 아닌 토큰이면 ParserError를 발생시킨다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'IDENTIFIER', lexeme: 'x', position: { line: 1, column: 1 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 2 } },
      ];
      const state = createParserState(tokens);

      // When
      const when = () => consumeKeyword(state, 'plant', 'Expected "plant"');

      // Then
      expect(when).toThrow(ParserError);
    });
  });

  describe('matchType', () => {
    test('기대한 타입과 일치하면 소비하고 true를 반환한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'LEFT_PAREN', lexeme: '(', position: { line: 1, column: 1 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 2 } },
      ];
      const state = createParserState(tokens);

      // When
      const result = matchType(state, 'LEFT_PAREN');

      // Then
      expect(result).toBe(true);
      expect(state.current).toBe(1);
    });

    test('기대한 타입과 일치하지 않으면 false를 반환한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'RIGHT_PAREN', lexeme: ')', position: { line: 1, column: 1 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 2 } },
      ];
      const state = createParserState(tokens);

      // When
      const result = matchType(state, 'LEFT_PAREN');

      // Then
      expect(result).toBe(false);
      expect(state.current).toBe(0); // 위치는 변경되지 않음
    });
  });

  describe('matchKeyword', () => {
    test('기대한 키워드와 일치하면 소비하고 true를 반환한다', () => {
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
      const result = matchKeyword(state, 'plant');

      // Then
      expect(result).toBe(true);
      expect(state.current).toBe(1);
    });

    test('기대한 키워드와 일치하지 않으면 false를 반환한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'KEYWORD',
          keyword: 'petal',
          lexeme: 'petal',
          position: { line: 1, column: 1 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 6 } },
      ];
      const state = createParserState(tokens);

      // When
      const result = matchKeyword(state, 'plant');

      // Then
      expect(result).toBe(false);
      expect(state.current).toBe(0); // 위치는 변경되지 않음
    });

    test('키워드가 아닌 토큰이면 false를 반환한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'IDENTIFIER', lexeme: 'x', position: { line: 1, column: 1 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 2 } },
      ];
      const state = createParserState(tokens);

      // When
      const result = matchKeyword(state, 'plant');

      // Then
      expect(result).toBe(false);
      expect(state.current).toBe(0);
    });
  });
});
