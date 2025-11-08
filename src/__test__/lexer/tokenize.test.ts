import { tokenize, LexerError } from '@core/lexer/engine/index.js';
import { formatLexerError } from '@core/errors/formatter.js';
import type { Token } from '@core/lexer/tokens.js';

describe('tokenize 클래스는 소스 코드를 토큰 배열로 변환한다', () => {
  test('lexer는 키워드, 식별자, 리터럴, 연산자를 토큰으로 변환한다', () => {
    // Given
    const source = `
plant feeling = "gentle"
plant season = 0

breeze (feeling == "gentle") softly {
  sparkle season + 1
}
`.trim();

    // When
    const tokens = tokenize(source);

    // Then
    const types = tokens.map((token: Token) => token.type);
    expect(types).toEqual([
      'KEYWORD',
      'IDENTIFIER',
      'EQUAL',
      'STRING',
      'KEYWORD',
      'IDENTIFIER',
      'EQUAL',
      'NUMBER',
      'KEYWORD',
      'LEFT_PAREN',
      'IDENTIFIER',
      'EQUAL_EQUAL',
      'STRING',
      'RIGHT_PAREN',
      'KEYWORD',
      'LEFT_BRACE',
      'KEYWORD',
      'IDENTIFIER',
      'PLUS',
      'NUMBER',
      'RIGHT_BRACE',
      'EOF',
    ]);

    expect(tokens[0]).toMatchObject({
      type: 'KEYWORD',
      keyword: 'plant',
      lexeme: 'plant',
    });

    expect(tokens[3]).toMatchObject({
      type: 'STRING',
      literal: 'gentle',
    });

    expect(tokens[7]).toMatchObject({
      type: 'NUMBER',
      literal: 0,
    });
  });

  test('lexer는 토큰의 줄과 열 정보를 추적한다', () => {
    // Given
    const source = `plant feeling = 1
sparkle feeling`;

    // When
    const tokens = tokenize(source);

    // Then
    const identifier = tokens.find(
      (token: Token) =>
        token.type === 'IDENTIFIER' && token.lexeme === 'feeling'
    );
    expect(identifier).toBeDefined();
    expect(identifier?.position).toEqual({ line: 1, column: 7 });

    const sparkle = tokens.find((token: Token) => token.keyword === 'sparkle');
    expect(sparkle?.position).toEqual({ line: 2, column: 1 });
  });

  test('lexer는 주석과 공백을 무시한다', () => {
    // Given
    const source = `
plant name = "mint" // whisper
// entire line comment
sparkle name
`;

    // When
    const tokens = tokenize(source);

    // Then
    expect(tokens.map((t: Token) => t.type)).toEqual([
      'KEYWORD',
      'IDENTIFIER',
      'EQUAL',
      'STRING',
      'KEYWORD',
      'IDENTIFIER',
      'EOF',
    ]);
  });

  test('lexer는 예상치 못한 문자를 만나면 에러를 발생시킨다', () => {
    // Given
    const source = 'plant $flower = 1';

    // When
    const when = () => tokenize(source);

    // Then
    expect(when).toThrow(LexerError);
    let thrown: unknown;
    try {
      tokenize(source);
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(LexerError);
    if (thrown instanceof LexerError) {
      expect(thrown.code).toBe('LEXER_UNEXPECTED_CHARACTER');
      expect(thrown.details).toEqual({ char: '$' });
      expect(formatLexerError(thrown)).toContain("Unexpected character '$'");
    }
  });

  test('lexer는 문자열 리터럴이 끝나지 않으면 에러를 발생시킨다', () => {
    // Given
    const source = 'sparkle "hello';

    // When
    const when = () => tokenize(source);

    // Then
    expect(when).toThrow(LexerError);
    try {
      tokenize(source);
    } catch (error) {
      expect(error).toBeInstanceOf(LexerError);
      if (error instanceof LexerError) {
        expect(error.code).toBe('LEXER_UNTERMINATED_STRING');
        expect(formatLexerError(error)).toContain('Unterminated string literal');
      }
    }
  });
});
