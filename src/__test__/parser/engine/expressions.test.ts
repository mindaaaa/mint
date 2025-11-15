import { ExpressionParser } from '@core/parser/engine/expressions.js';
import { createParserState } from '@core/parser/engine/state.js';
import { ParserError } from '@core/parser/errors/errors.js';
import type { Token } from '@core/lexer/tokens.js';

describe('ExpressionParser', () => {
  describe('primary', () => {
    test('숫자 리터럴을 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'NUMBER',
          lexeme: '123',
          literal: 123,
          position: { line: 1, column: 1 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 4 } },
      ];
      const state = createParserState(tokens);
      const parser = new ExpressionParser(state);

      // When
      const expr = parser.expression();

      // Then
      expect(expr).toEqual({
        type: 'LiteralExpression',
        value: 123,
      });
    });

    test('문자열 리터럴을 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'STRING',
          lexeme: '"hello"',
          literal: 'hello',
          position: { line: 1, column: 1 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 8 } },
      ];
      const state = createParserState(tokens);
      const parser = new ExpressionParser(state);

      // When
      const expr = parser.expression();

      // Then
      expect(expr).toEqual({
        type: 'LiteralExpression',
        value: 'hello',
      });
    });

    test('식별자를 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'IDENTIFIER', lexeme: 'x', position: { line: 1, column: 1 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 2 } },
      ];
      const state = createParserState(tokens);
      const parser = new ExpressionParser(state);

      // When
      const expr = parser.expression();

      // Then
      expect(expr).toEqual({
        type: 'IdentifierExpression',
        name: 'x',
      });
    });

    test('그룹핑 표현식을 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'LEFT_PAREN', lexeme: '(', position: { line: 1, column: 1 } },
        {
          type: 'NUMBER',
          lexeme: '1',
          literal: 1,
          position: { line: 1, column: 2 },
        },
        { type: 'RIGHT_PAREN', lexeme: ')', position: { line: 1, column: 3 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 4 } },
      ];
      const state = createParserState(tokens);
      const parser = new ExpressionParser(state);

      // When
      const expr = parser.expression();

      // Then
      expect(expr).toEqual({
        type: 'GroupingExpression',
        expression: {
          type: 'LiteralExpression',
          value: 1,
        },
      });
    });

    test('예상치 못한 토큰이면 ParserError를 발생시킨다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'LEFT_BRACE', lexeme: '{', position: { line: 1, column: 1 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 2 } },
      ];
      const state = createParserState(tokens);
      const parser = new ExpressionParser(state);

      // When
      const when = () => parser.expression();

      // Then
      expect(when).toThrow(ParserError);
      try {
        parser.expression();
      } catch (error) {
        expect(error).toBeInstanceOf(ParserError);
        if (error instanceof ParserError) {
          expect(error.code).toBe('PARSER_UNEXPECTED_TOKEN');
        }
      }
    });
  });

  describe('unary', () => {
    test('단항 부정 연산자를 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'BANG', lexeme: '!', position: { line: 1, column: 1 } },
        {
          type: 'NUMBER',
          lexeme: '1',
          literal: 1,
          position: { line: 1, column: 2 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 3 } },
      ];
      const state = createParserState(tokens);
      const parser = new ExpressionParser(state);

      // When
      const expr = parser.expression();

      // Then
      expect(expr).toEqual({
        type: 'UnaryExpression',
        operator: '!',
        argument: {
          type: 'LiteralExpression',
          value: 1,
        },
      });
    });

    test('단항 음수 연산자를 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'MINUS', lexeme: '-', position: { line: 1, column: 1 } },
        {
          type: 'NUMBER',
          lexeme: '1',
          literal: 1,
          position: { line: 1, column: 2 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 3 } },
      ];
      const state = createParserState(tokens);
      const parser = new ExpressionParser(state);

      // When
      const expr = parser.expression();

      // Then
      expect(expr).toEqual({
        type: 'UnaryExpression',
        operator: '-',
        argument: {
          type: 'LiteralExpression',
          value: 1,
        },
      });
    });
  });

  describe('factor', () => {
    test('곱셈 연산자를 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'NUMBER',
          lexeme: '2',
          literal: 2,
          position: { line: 1, column: 1 },
        },
        { type: 'STAR', lexeme: '*', position: { line: 1, column: 3 } },
        {
          type: 'NUMBER',
          lexeme: '3',
          literal: 3,
          position: { line: 1, column: 5 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 6 } },
      ];
      const state = createParserState(tokens);
      const parser = new ExpressionParser(state);

      // When
      const expr = parser.expression();

      // Then
      expect(expr).toEqual({
        type: 'BinaryExpression',
        operator: '*',
        left: { type: 'LiteralExpression', value: 2 },
        right: { type: 'LiteralExpression', value: 3 },
      });
    });

    test('나눗셈 연산자를 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'NUMBER',
          lexeme: '6',
          literal: 6,
          position: { line: 1, column: 1 },
        },
        { type: 'SLASH', lexeme: '/', position: { line: 1, column: 3 } },
        {
          type: 'NUMBER',
          lexeme: '2',
          literal: 2,
          position: { line: 1, column: 5 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 6 } },
      ];
      const state = createParserState(tokens);
      const parser = new ExpressionParser(state);

      // When
      const expr = parser.expression();

      // Then
      expect(expr).toEqual({
        type: 'BinaryExpression',
        operator: '/',
        left: { type: 'LiteralExpression', value: 6 },
        right: { type: 'LiteralExpression', value: 2 },
      });
    });
  });

  describe('term', () => {
    test('덧셈 연산자를 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'NUMBER',
          lexeme: '1',
          literal: 1,
          position: { line: 1, column: 1 },
        },
        { type: 'PLUS', lexeme: '+', position: { line: 1, column: 3 } },
        {
          type: 'NUMBER',
          lexeme: '2',
          literal: 2,
          position: { line: 1, column: 5 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 6 } },
      ];
      const state = createParserState(tokens);
      const parser = new ExpressionParser(state);

      // When
      const expr = parser.expression();

      // Then
      expect(expr).toEqual({
        type: 'BinaryExpression',
        operator: '+',
        left: { type: 'LiteralExpression', value: 1 },
        right: { type: 'LiteralExpression', value: 2 },
      });
    });

    test('뺄셈 연산자를 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'NUMBER',
          lexeme: '5',
          literal: 5,
          position: { line: 1, column: 1 },
        },
        { type: 'MINUS', lexeme: '-', position: { line: 1, column: 3 } },
        {
          type: 'NUMBER',
          lexeme: '3',
          literal: 3,
          position: { line: 1, column: 5 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 6 } },
      ];
      const state = createParserState(tokens);
      const parser = new ExpressionParser(state);

      // When
      const expr = parser.expression();

      // Then
      expect(expr).toEqual({
        type: 'BinaryExpression',
        operator: '-',
        left: { type: 'LiteralExpression', value: 5 },
        right: { type: 'LiteralExpression', value: 3 },
      });
    });
  });

  describe('comparison', () => {
    test('작음 비교 연산자를 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'NUMBER',
          lexeme: '1',
          literal: 1,
          position: { line: 1, column: 1 },
        },
        { type: 'LESS', lexeme: '<', position: { line: 1, column: 3 } },
        {
          type: 'NUMBER',
          lexeme: '2',
          literal: 2,
          position: { line: 1, column: 5 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 6 } },
      ];
      const state = createParserState(tokens);
      const parser = new ExpressionParser(state);

      // When
      const expr = parser.expression();

      // Then
      expect(expr).toEqual({
        type: 'BinaryExpression',
        operator: '<',
        left: { type: 'LiteralExpression', value: 1 },
        right: { type: 'LiteralExpression', value: 2 },
      });
    });

    test('작거나 같음 비교 연산자를 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'NUMBER',
          lexeme: '1',
          literal: 1,
          position: { line: 1, column: 1 },
        },
        { type: 'LESS_EQUAL', lexeme: '<=', position: { line: 1, column: 3 } },
        {
          type: 'NUMBER',
          lexeme: '2',
          literal: 2,
          position: { line: 1, column: 5 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 6 } },
      ];
      const state = createParserState(tokens);
      const parser = new ExpressionParser(state);

      // When
      const expr = parser.expression();

      // Then
      expect(expr).toEqual({
        type: 'BinaryExpression',
        operator: '<=',
        left: { type: 'LiteralExpression', value: 1 },
        right: { type: 'LiteralExpression', value: 2 },
      });
    });
  });

  describe('equality', () => {
    test('동등 비교 연산자를 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'NUMBER',
          lexeme: '1',
          literal: 1,
          position: { line: 1, column: 1 },
        },
        { type: 'EQUAL_EQUAL', lexeme: '==', position: { line: 1, column: 3 } },
        {
          type: 'NUMBER',
          lexeme: '2',
          literal: 2,
          position: { line: 1, column: 5 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 6 } },
      ];
      const state = createParserState(tokens);
      const parser = new ExpressionParser(state);

      // When
      const expr = parser.expression();

      // Then
      expect(expr).toEqual({
        type: 'BinaryExpression',
        operator: '==',
        left: { type: 'LiteralExpression', value: 1 },
        right: { type: 'LiteralExpression', value: 2 },
      });
    });

    test('부등 비교 연산자를 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'NUMBER',
          lexeme: '1',
          literal: 1,
          position: { line: 1, column: 1 },
        },
        { type: 'BANG_EQUAL', lexeme: '!=', position: { line: 1, column: 3 } },
        {
          type: 'NUMBER',
          lexeme: '2',
          literal: 2,
          position: { line: 1, column: 5 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 6 } },
      ];
      const state = createParserState(tokens);
      const parser = new ExpressionParser(state);

      // When
      const expr = parser.expression();

      // Then
      expect(expr).toEqual({
        type: 'BinaryExpression',
        operator: '!=',
        left: { type: 'LiteralExpression', value: 1 },
        right: { type: 'LiteralExpression', value: 2 },
      });
    });
  });

  describe('assignment', () => {
    test('대입 표현식을 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'IDENTIFIER', lexeme: 'x', position: { line: 1, column: 1 } },
        { type: 'EQUAL', lexeme: '=', position: { line: 1, column: 3 } },
        {
          type: 'NUMBER',
          lexeme: '1',
          literal: 1,
          position: { line: 1, column: 5 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 6 } },
      ];
      const state = createParserState(tokens);
      const parser = new ExpressionParser(state);

      // When
      const expr = parser.expression();

      // Then
      expect(expr).toEqual({
        type: 'AssignmentExpression',
        identifier: { type: 'IdentifierExpression', name: 'x' },
        value: { type: 'LiteralExpression', value: 1 },
      });
    });

    test('식별자가 아닌 대상에 대입하면 ParserError를 발생시킨다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'NUMBER',
          lexeme: '1',
          literal: 1,
          position: { line: 1, column: 1 },
        },
        { type: 'EQUAL', lexeme: '=', position: { line: 1, column: 3 } },
        {
          type: 'NUMBER',
          lexeme: '2',
          literal: 2,
          position: { line: 1, column: 5 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 6 } },
      ];
      const state = createParserState(tokens);
      const parser = new ExpressionParser(state);

      // When
      const when = () => parser.expression();

      // Then
      expect(when).toThrow(ParserError);
      try {
        parser.expression();
      } catch (error) {
        expect(error).toBeInstanceOf(ParserError);
        if (error instanceof ParserError) {
          expect(error.code).toBe('PARSER_UNEXPECTED_TOKEN');
        }
      }
    });
  });

  describe('call', () => {
    test('함수 호출 표현식을 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'IDENTIFIER', lexeme: 'foo', position: { line: 1, column: 1 } },
        { type: 'LEFT_PAREN', lexeme: '(', position: { line: 1, column: 4 } },
        { type: 'RIGHT_PAREN', lexeme: ')', position: { line: 1, column: 5 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 6 } },
      ];
      const state = createParserState(tokens);
      const parser = new ExpressionParser(state);

      // When
      const expr = parser.expression();

      // Then
      expect(expr).toEqual({
        type: 'CallExpression',
        callee: { type: 'IdentifierExpression', name: 'foo' },
        args: [],
      });
    });

    test('인수가 있는 함수 호출 표현식을 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'IDENTIFIER', lexeme: 'foo', position: { line: 1, column: 1 } },
        { type: 'LEFT_PAREN', lexeme: '(', position: { line: 1, column: 4 } },
        {
          type: 'NUMBER',
          lexeme: '1',
          literal: 1,
          position: { line: 1, column: 5 },
        },
        { type: 'COMMA', lexeme: ',', position: { line: 1, column: 6 } },
        {
          type: 'NUMBER',
          lexeme: '2',
          literal: 2,
          position: { line: 1, column: 8 },
        },
        { type: 'RIGHT_PAREN', lexeme: ')', position: { line: 1, column: 9 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 10 } },
      ];
      const state = createParserState(tokens);
      const parser = new ExpressionParser(state);

      // When
      const expr = parser.expression();

      // Then
      expect(expr).toEqual({
        type: 'CallExpression',
        callee: { type: 'IdentifierExpression', name: 'foo' },
        args: [
          { type: 'LiteralExpression', value: 1 },
          { type: 'LiteralExpression', value: 2 },
        ],
      });
    });
  });

  describe('연산자 우선순위', () => {
    test('곱셈이 덧셈보다 우선순위가 높다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'NUMBER',
          lexeme: '1',
          literal: 1,
          position: { line: 1, column: 1 },
        },
        { type: 'PLUS', lexeme: '+', position: { line: 1, column: 3 } },
        {
          type: 'NUMBER',
          lexeme: '2',
          literal: 2,
          position: { line: 1, column: 5 },
        },
        { type: 'STAR', lexeme: '*', position: { line: 1, column: 7 } },
        {
          type: 'NUMBER',
          lexeme: '3',
          literal: 3,
          position: { line: 1, column: 9 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 10 } },
      ];
      const state = createParserState(tokens);
      const parser = new ExpressionParser(state);

      // When
      const expr = parser.expression();

      // Then
      expect(expr).toEqual({
        type: 'BinaryExpression',
        operator: '+',
        left: { type: 'LiteralExpression', value: 1 },
        right: {
          type: 'BinaryExpression',
          operator: '*',
          left: { type: 'LiteralExpression', value: 2 },
          right: { type: 'LiteralExpression', value: 3 },
        },
      });
    });
  });
});
