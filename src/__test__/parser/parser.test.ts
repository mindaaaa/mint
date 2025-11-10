import { tokenize } from '@core/lexer/engine/index.js';
import { parse } from '@core/parser/parser.js';
import { ParserError } from '@core/parser/errors/errors.js';
import { formatParserError } from '@core/errors/formatter.js';

const SAMPLE_SOURCE = `
plant feeling = "gentle"
plant season = 0

breeze (feeling == "gentle") softly {
  sparkle "the breeze whispers softly"
}

bloom (season < 3) softly {
  sparkle season
  plant season = season + 1
}

petal greet(name) {
  sparkle "hello, " + name
  gift "🌼"
}
`;

describe('parse', () => {
  test('프로그램을 AST로 변환한다', () => {
    // Given
    const tokens = tokenize(SAMPLE_SOURCE);

    // When
    const ast = parse(tokens);

    // Then
    expect(ast).toMatchObject({
      type: 'Program',
      body: [
        {
          type: 'VariableDeclaration',
          identifier: { name: 'feeling' },
        },
        {
          type: 'VariableDeclaration',
          identifier: { name: 'season' },
        },
        {
          type: 'IfStatement',
          condition: {
            type: 'BinaryExpression',
            operator: '==',
          },
        },
        {
          type: 'WhileStatement',
          condition: {
            type: 'BinaryExpression',
            operator: '<',
          },
        },
        {
          type: 'FunctionDeclaration',
          name: { name: 'greet' },
          params: [{ name: 'name' }],
        },
      ],
    });
  });

  test('구문 오류 발생 시 ParserError를 던진다', () => {
    // Given
    const source = 'plant name = 1 breeze ( name '; // 누락된 요소
    const tokens = tokenize(source);

    // When
    const when = () => parse(tokens);

    // Then
    expect(when).toThrow(ParserError);
    try {
      parse(tokens);
    } catch (error) {
      expect(error).toBeInstanceOf(ParserError);
      if (error instanceof ParserError) {
        expect(formatParserError(error)).toContain('Expected');
      }
    }
  });
});
