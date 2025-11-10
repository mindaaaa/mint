import { tokenize } from '@core/lexer/engine/index.js';
import { parse } from '@core/parser/parser.js';
import { evaluateProgram, EvaluatorError } from '@core/evaluator/index.js';

function run(source: string) {
  const tokens = tokenize(source);
  const program = parse(tokens);
  return evaluateProgram(program);
}

describe('Evaluator - expressions', () => {
  test('산술 및 비교 연산을 평가한다', () => {
    // Given
    const source = `
      plant sum = 2 + 3 * 4
      sparkle sum
      sparkle (10 - 4) / 2
      sparkle 5 == 5
      sparkle 2 < 3
      plant greeting = "hello, " + "mint"
      sparkle greeting
    `;

    // When
    const result = run(source);

    // Then
    expect(result.stdout).toEqual(['14', '3', 'true', 'true', 'hello, mint']);
  });

  test('문자열 결합을 지원한다', () => {
    // Given
    const source = `
      plant name = "Mint"
      plant greeting = "hello, " + name
      sparkle greeting
    `;

    // When
    const result = run(source);

    // Then
    expect(result.stdout).toEqual(['hello, Mint']);
  });

  test('부적절한 타입 연산 시 EvaluatorError를 던진다', () => {
    // Given
    const source = `
      plant name = "Mint"
      plant value = name - 1
    `;

    // When
    const when = () => run(source);

    // Then
    expect(when).toThrow(EvaluatorError);
    try {
      when();
    } catch (error) {
      expect(error).toBeInstanceOf(EvaluatorError);
    }
  });
});
