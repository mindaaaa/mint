import { runSource } from '../../app/run/runner.js';
import { formatMintError, formatSuccess } from '../../app/run/formatter.js';

describe('CLI runSource', () => {
  test('성공적으로 소스를 실행하고 stdout을 수집한다', () => {
    // Given
    const source = `
sparkle "hello, mint"
`;

    // When
    const result = runSource(source);

    // Then
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.stdout).toEqual(['hello, mint']);
    }
  });

  test('렉서 오류를 MintError로 변환한다', () => {
    // Given
    const source = `
$sparkle "oops"
`;

    // When
    const result = runSource(source, { filename: 'examples/oops.mint' });

    // Then
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const formatted = formatMintError(result.error);
      expect(result.error.origin).toBe('LEXER');
      expect(formatted.headline).toContain('Lexer Error');
      expect(formatted.details.join('\n')).toContain('Unexpected character');
      expect(formatted.details.join('\n')).toContain('examples/oops.mint');
    }
  });

  test('출력이 없으면 기본 메시지를 보여준다', () => {
    // Given
    const result = formatSuccess([]);

    // When & Then
    expect(result.body).toEqual(['  (no output)']);
  });
});
