import { tokenize } from '@core/lexer/engine/index.js';
import { parse } from '@core/parser/parser.js';
import { evaluateProgram } from '@core/evaluator/index.js';

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

describe('Integration - control flow', () => {
  test('README 예제를 성공적으로 평가한다', () => {
    // Given
    const source = SAMPLE_SOURCE;

    // When
    const tokens = tokenize(source);
    const program = parse(tokens);
    const result = evaluateProgram(program);

    // Then
    expect(result.stdout).toEqual([
      'the breeze whispers softly',
      '0',
      '1',
      '2',
    ]);
    expect(result.environment.get('season')).toBe(3);
  });
});
