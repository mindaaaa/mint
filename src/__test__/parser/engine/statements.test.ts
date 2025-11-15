import { StatementParser } from '@core/parser/engine/statements.js';
import { createParserState } from '@core/parser/engine/state.js';
import { ParserError } from '@core/parser/errors/errors.js';
import type { Token } from '@core/lexer/tokens.js';

describe('StatementParser', () => {
  describe('variableDeclaration', () => {
    test('초기값이 없는 변수 선언을 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'KEYWORD',
          keyword: 'plant',
          lexeme: 'plant',
          position: { line: 1, column: 1 },
        },
        { type: 'IDENTIFIER', lexeme: 'x', position: { line: 1, column: 7 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 8 } },
      ];
      const state = createParserState(tokens);
      const parser = new StatementParser(state);

      // When
      const stmt = parser.declaration();

      // Then
      expect(stmt).toEqual({
        type: 'VariableDeclaration',
        identifier: { type: 'IdentifierExpression', name: 'x' },
        initializer: undefined,
      });
    });

    test('초기값이 있는 변수 선언을 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'KEYWORD',
          keyword: 'plant',
          lexeme: 'plant',
          position: { line: 1, column: 1 },
        },
        { type: 'IDENTIFIER', lexeme: 'x', position: { line: 1, column: 7 } },
        { type: 'EQUAL', lexeme: '=', position: { line: 1, column: 9 } },
        {
          type: 'NUMBER',
          lexeme: '1',
          literal: 1,
          position: { line: 1, column: 11 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 12 } },
      ];
      const state = createParserState(tokens);
      const parser = new StatementParser(state);

      // When
      const stmt = parser.declaration();

      // Then
      expect(stmt).toEqual({
        type: 'VariableDeclaration',
        identifier: { type: 'IdentifierExpression', name: 'x' },
        initializer: { type: 'LiteralExpression', value: 1 },
      });
    });
  });

  describe('functionDeclaration', () => {
    test('매개변수가 없는 함수 선언을 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'KEYWORD',
          keyword: 'petal',
          lexeme: 'petal',
          position: { line: 1, column: 1 },
        },
        { type: 'IDENTIFIER', lexeme: 'foo', position: { line: 1, column: 7 } },
        { type: 'LEFT_PAREN', lexeme: '(', position: { line: 1, column: 10 } },
        { type: 'RIGHT_PAREN', lexeme: ')', position: { line: 1, column: 11 } },
        { type: 'LEFT_BRACE', lexeme: '{', position: { line: 1, column: 13 } },
        { type: 'RIGHT_BRACE', lexeme: '}', position: { line: 1, column: 14 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 15 } },
      ];
      const state = createParserState(tokens);
      const parser = new StatementParser(state);

      // When
      const stmt = parser.declaration();

      // Then
      expect(stmt).toEqual({
        type: 'FunctionDeclaration',
        name: { type: 'IdentifierExpression', name: 'foo' },
        params: [],
        body: { type: 'BlockStatement', body: [] },
      });
    });

    test('매개변수가 있는 함수 선언을 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'KEYWORD',
          keyword: 'petal',
          lexeme: 'petal',
          position: { line: 1, column: 1 },
        },
        { type: 'IDENTIFIER', lexeme: 'foo', position: { line: 1, column: 7 } },
        { type: 'LEFT_PAREN', lexeme: '(', position: { line: 1, column: 10 } },
        { type: 'IDENTIFIER', lexeme: 'x', position: { line: 1, column: 11 } },
        { type: 'COMMA', lexeme: ',', position: { line: 1, column: 12 } },
        { type: 'IDENTIFIER', lexeme: 'y', position: { line: 1, column: 14 } },
        { type: 'RIGHT_PAREN', lexeme: ')', position: { line: 1, column: 15 } },
        { type: 'LEFT_BRACE', lexeme: '{', position: { line: 1, column: 17 } },
        { type: 'RIGHT_BRACE', lexeme: '}', position: { line: 1, column: 18 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 19 } },
      ];
      const state = createParserState(tokens);
      const parser = new StatementParser(state);

      // When
      const stmt = parser.declaration();

      // Then
      expect(stmt).toEqual({
        type: 'FunctionDeclaration',
        name: { type: 'IdentifierExpression', name: 'foo' },
        params: [
          { type: 'IdentifierExpression', name: 'x' },
          { type: 'IdentifierExpression', name: 'y' },
        ],
        body: { type: 'BlockStatement', body: [] },
      });
    });
  });

  describe('ifStatement', () => {
    test('if 문을 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'KEYWORD',
          keyword: 'breeze',
          lexeme: 'breeze',
          position: { line: 1, column: 1 },
        },
        { type: 'LEFT_PAREN', lexeme: '(', position: { line: 1, column: 8 } },
        {
          type: 'NUMBER',
          lexeme: '1',
          literal: 1,
          position: { line: 1, column: 9 },
        },
        { type: 'RIGHT_PAREN', lexeme: ')', position: { line: 1, column: 10 } },
        {
          type: 'KEYWORD',
          keyword: 'softly',
          lexeme: 'softly',
          position: { line: 1, column: 12 },
        },
        { type: 'LEFT_BRACE', lexeme: '{', position: { line: 1, column: 19 } },
        { type: 'RIGHT_BRACE', lexeme: '}', position: { line: 1, column: 20 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 21 } },
      ];
      const state = createParserState(tokens);
      const parser = new StatementParser(state);

      // When
      const stmt = parser.declaration();

      // Then
      expect(stmt).toEqual({
        type: 'IfStatement',
        condition: { type: 'LiteralExpression', value: 1 },
        consequent: { type: 'BlockStatement', body: [] },
      });
    });
  });

  describe('whileStatement', () => {
    test('while 문을 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'KEYWORD',
          keyword: 'bloom',
          lexeme: 'bloom',
          position: { line: 1, column: 1 },
        },
        { type: 'LEFT_PAREN', lexeme: '(', position: { line: 1, column: 7 } },
        {
          type: 'NUMBER',
          lexeme: '1',
          literal: 1,
          position: { line: 1, column: 8 },
        },
        { type: 'RIGHT_PAREN', lexeme: ')', position: { line: 1, column: 9 } },
        {
          type: 'KEYWORD',
          keyword: 'softly',
          lexeme: 'softly',
          position: { line: 1, column: 11 },
        },
        { type: 'LEFT_BRACE', lexeme: '{', position: { line: 1, column: 18 } },
        { type: 'RIGHT_BRACE', lexeme: '}', position: { line: 1, column: 19 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 20 } },
      ];
      const state = createParserState(tokens);
      const parser = new StatementParser(state);

      // When
      const stmt = parser.declaration();

      // Then
      expect(stmt).toEqual({
        type: 'WhileStatement',
        condition: { type: 'LiteralExpression', value: 1 },
        body: { type: 'BlockStatement', body: [] },
      });
    });
  });

  describe('returnStatement', () => {
    test('값이 없는 return 문을 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'KEYWORD',
          keyword: 'gift',
          lexeme: 'gift',
          position: { line: 1, column: 1 },
        },
        { type: 'SEMICOLON', lexeme: ';', position: { line: 1, column: 5 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 6 } },
      ];
      const state = createParserState(tokens);
      const parser = new StatementParser(state);

      // When
      const stmt = parser.declaration();

      // Then
      expect(stmt).toEqual({
        type: 'ReturnStatement',
        argument: undefined,
      });
    });

    test('값이 있는 return 문을 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'KEYWORD',
          keyword: 'gift',
          lexeme: 'gift',
          position: { line: 1, column: 1 },
        },
        {
          type: 'NUMBER',
          lexeme: '1',
          literal: 1,
          position: { line: 1, column: 6 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 7 } },
      ];
      const state = createParserState(tokens);
      const parser = new StatementParser(state);

      // When
      const stmt = parser.declaration();

      // Then
      expect(stmt).toEqual({
        type: 'ReturnStatement',
        argument: { type: 'LiteralExpression', value: 1 },
      });
    });
  });

  describe('sparkleStatement', () => {
    test('sparkle 문을 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'KEYWORD',
          keyword: 'sparkle',
          lexeme: 'sparkle',
          position: { line: 1, column: 1 },
        },
        {
          type: 'NUMBER',
          lexeme: '1',
          literal: 1,
          position: { line: 1, column: 9 },
        },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 10 } },
      ];
      const state = createParserState(tokens);
      const parser = new StatementParser(state);

      // When
      const stmt = parser.declaration();

      // Then
      expect(stmt).toEqual({
        type: 'SparkleStatement',
        expression: { type: 'LiteralExpression', value: 1 },
      });
    });
  });

  describe('expressionStatement', () => {
    test('표현식 문을 파싱한다', () => {
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
      const parser = new StatementParser(state);

      // When
      const stmt = parser.declaration();

      // Then
      expect(stmt).toEqual({
        type: 'ExpressionStatement',
        expression: {
          type: 'AssignmentExpression',
          identifier: { type: 'IdentifierExpression', name: 'x' },
          value: { type: 'LiteralExpression', value: 1 },
        },
      });
    });
  });

  describe('blockStatement', () => {
    test('블록 문을 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'LEFT_BRACE', lexeme: '{', position: { line: 1, column: 1 } },
        { type: 'RIGHT_BRACE', lexeme: '}', position: { line: 1, column: 2 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 3 } },
      ];
      const state = createParserState(tokens);
      const parser = new StatementParser(state);

      // When
      const stmt = parser.declaration();

      // Then
      expect(stmt).toEqual({
        type: 'BlockStatement',
        body: [],
      });
    });

    test('여러 문장이 있는 블록을 파싱한다', () => {
      // Given
      const tokens: Token[] = [
        { type: 'LEFT_BRACE', lexeme: '{', position: { line: 1, column: 1 } },
        {
          type: 'KEYWORD',
          keyword: 'plant',
          lexeme: 'plant',
          position: { line: 1, column: 3 },
        },
        { type: 'IDENTIFIER', lexeme: 'x', position: { line: 1, column: 9 } },
        {
          type: 'KEYWORD',
          keyword: 'plant',
          lexeme: 'plant',
          position: { line: 1, column: 11 },
        },
        { type: 'IDENTIFIER', lexeme: 'y', position: { line: 1, column: 17 } },
        { type: 'RIGHT_BRACE', lexeme: '}', position: { line: 1, column: 19 } },
        { type: 'EOF', lexeme: '', position: { line: 1, column: 20 } },
      ];
      const state = createParserState(tokens);
      const parser = new StatementParser(state);

      // When
      const stmt = parser.declaration();

      // Then
      expect(stmt).toEqual({
        type: 'BlockStatement',
        body: [
          {
            type: 'VariableDeclaration',
            identifier: { type: 'IdentifierExpression', name: 'x' },
            initializer: undefined,
          },
          {
            type: 'VariableDeclaration',
            identifier: { type: 'IdentifierExpression', name: 'y' },
            initializer: undefined,
          },
        ],
      });
    });
  });

  describe('에러 처리', () => {
    test('구문 오류 발생 시 ParserError를 발생시킨다', () => {
      // Given
      const tokens: Token[] = [
        {
          type: 'KEYWORD',
          keyword: 'plant',
          lexeme: 'plant',
          position: { line: 1, column: 1 },
        },
        { type: 'EQUAL', lexeme: '=', position: { line: 1, column: 7 } }, // 식별자 누락
        { type: 'EOF', lexeme: '', position: { line: 1, column: 8 } },
      ];
      const state = createParserState(tokens);
      const parser = new StatementParser(state);

      // When
      const when = () => parser.declaration();

      // Then
      expect(when).toThrow(ParserError);
    });
  });
});
