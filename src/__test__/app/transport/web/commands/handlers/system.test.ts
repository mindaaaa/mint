import {
  help,
  clear,
  echo,
  date,
  history,
  version,
} from '@web/commands/handlers/system.js';
import type { CommandContext } from '@web/commands/types.js';

describe('system commands', () => {
  let mockContext: CommandContext;

  beforeEach(() => {
    mockContext = {
      setLines: jest.fn(),
      commandHistory: [],
      lines: [],
    };
  });

  describe('help', () => {
    test('도움말을 반환한다', () => {
      const result = help([], mockContext);

      expect(typeof result).toBe('string');
      expect(result).toContain('MINT 명령어');
      expect(result).toContain('help');
      expect(result).toContain('clear');
    });
  });

  describe('clear', () => {
    test('clear: true를 반환한다', () => {
      const result = clear([], mockContext);

      expect(result).toEqual({ clear: true });
    });
  });

  describe('echo', () => {
    test('인수를 공백으로 연결하여 반환한다', () => {
      const result = echo(['hello', 'world'], mockContext);

      expect(result).toEqual({ output: 'hello world' });
    });

    test('인수가 없으면 빈 문자열을 반환한다', () => {
      const result = echo([], mockContext);

      expect(result).toEqual({ output: '' });
    });
  });

  describe('date', () => {
    test('현재 날짜와 시간을 반환한다', () => {
      const result = date([], mockContext);

      expect(typeof result).toBe('string');
      expect(result).toMatch(/\d{4}/); // 연도 포함
    });
  });

  describe('history', () => {
    test('명령어 히스토리가 없으면 메시지를 반환한다', () => {
      const result = history([], mockContext);

      expect(result).toBe('아직 기록된 부름이 없었습니다.');
    });

    test('명령어 히스토리를 번호와 함께 반환한다', () => {
      mockContext.commandHistory = ['help', 'echo hello', 'date'];

      const result = history([], mockContext);

      expect(result).toContain('1  help');
      expect(result).toContain('2  echo hello');
      expect(result).toContain('3  date');
    });
  });

  describe('version', () => {
    test('버전 정보를 반환한다', () => {
      const result = version([], mockContext);

      expect(result).toBe('mint v1.0.0');
    });
  });
});
