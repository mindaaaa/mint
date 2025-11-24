import { mint, whisper, example, about } from '@web/commands/handlers/mint.js';
import { runSource } from '@app/run/runner.js';
import type { CommandContext } from '@web/commands/types.js';

jest.mock('@app/run/runner.js', () => ({
  runSource: jest.fn(),
}));

describe('mint commands', () => {
  let mockContext: CommandContext;

  beforeEach(() => {
    mockContext = {
      setLines: jest.fn(),
      commandHistory: [],
      lines: [],
    };
    jest.clearAllMocks();
  });

  describe('mint', () => {
    test('MINT 코드를 실행한다', () => {
      (runSource as jest.Mock).mockReturnValue({
        ok: true,
        stdout: ['hello', 'world'],
      });

      const result = mint(['sparkle', '"hello"'], mockContext);

      expect(runSource).toHaveBeenCalledWith('sparkle "hello"', {
        filename: '<terminal>',
      });
      expect(result).toBe('hello\nworld');
    });

    test('코드가 없으면 에러를 반환한다', () => {
      const result = mint([], mockContext);

      expect(result).toEqual({
        error: '무엇을 속삭이고 싶으신가요?\n예: mint "plant x = 1 + 2"',
      });
      expect(runSource).not.toHaveBeenCalled();
    });

    test('실행 실패 시 에러를 반환한다', () => {
      (runSource as jest.Mock).mockReturnValue({
        ok: false,
        error: {
          message: 'Syntax error',
          hint: 'Check your syntax',
        },
      });

      const result = mint(['invalid code'], mockContext);

      expect(result).toEqual({
        error: '🔥 Syntax error\n  Hint: Check your syntax',
      });
    });

    test('stdout가 없으면 메시지를 반환한다', () => {
      (runSource as jest.Mock).mockReturnValue({
        ok: true,
        stdout: [],
      });

      const result = mint(['plant x = 1'], mockContext);

      expect(result).toBe(
        '코드가 조용히 흐릅니다. 출력은 없지만 실행되었습니다.'
      );
    });

    test('hint가 없으면 에러 메시지만 반환한다', () => {
      (runSource as jest.Mock).mockReturnValue({
        ok: false,
        error: {
          message: 'Runtime error',
        },
      });

      const result = mint(['invalid'], mockContext);

      expect(result).toEqual({
        error: '🔥 Runtime error',
      });
    });
  });

  describe('whisper', () => {
    test('메시지를 속삭인다', () => {
      const result = whisper(['hello', 'world'], mockContext);

      expect(result).toBe(
        '🌙 속삭임: hello world\n   ... 메시지가 부드럽게 흐릅니다 ...'
      );
    });

    test('메시지가 없으면 안내를 반환한다', () => {
      const result = whisper([], mockContext);

      expect(result).toBe(
        '무엇을 속삭이고 싶으신가요?\n예: whisper "peace and calm"'
      );
    });
  });

  describe('example', () => {
    test('MINT 예제를 반환한다', () => {
      const result = example([], mockContext);

      expect(typeof result).toBe('string');
      expect(result).toContain('MINT 예제');
      expect(result).toContain('sparkle');
    });
  });

  describe('about', () => {
    test('MINT 언어 소개를 반환한다', () => {
      const result = about([], mockContext);

      expect(typeof result).toBe('string');
      expect(result).toContain('MINT');
      expect(result).toContain('속삭이는');
      expect(result).toContain('철학');
    });
  });
});
