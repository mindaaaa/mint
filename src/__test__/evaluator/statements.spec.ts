import { tokenize } from '@core/lexer/engine/index.js';
import { parse } from '@core/parser/parser.js';
import { evaluateProgram } from '@core/evaluator/index.js';

function run(source: string) {
  const tokens = tokenize(source);
  const program = parse(tokens);
  return evaluateProgram(program);
}

describe('Evaluator - statements', () => {
  test('변수 선언과 반복문을 평가한다', () => {
    // Given
    const source = `
      plant counter = 0
      bloom (counter < 3) softly {
        sparkle counter
        plant counter = counter + 1
      }
      sparkle counter
    `;

    // When
    const result = run(source);

    // Then
    expect(result.stdout).toEqual(['0', '1', '2', '3']);
    expect(result.environment.get('counter')).toBe(3);
  });

  test('조건문을 평가한다', () => {
    // Given
    const source = `
      plant feeling = "gentle"
      breeze (feeling == "gentle") softly {
        sparkle "soft breeze"
      }
      breeze (feeling == "harsh") softly {
        sparkle "should not run"
      }
    `;

    // When
    const result = run(source);

    // Then
    expect(result.stdout).toEqual(['soft breeze']);
  });

  test('함수 선언과 반환을 평가한다', () => {
    // Given
    const source = `
      petal greet(name) {
        sparkle "hello, " + name
        gift name
      }

      plant received = greet("Mint")
      sparkle received
    `;

    // When
    const result = run(source);

    // Then
    expect(result.stdout).toEqual(['hello, Mint', 'Mint']);
    expect(result.environment.get('received')).toBe('Mint');
  });
});
