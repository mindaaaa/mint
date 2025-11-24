import { executeCommand } from '@web/commands/executor.js';
import type {
  CommandContext,
  CommandRegistry,
  TerminalLine,
} from '@web/commands/types.js';

describe('executeCommand', () => {
  let mockContext: CommandContext;
  let mockSetLines: jest.Mock;

  beforeEach(() => {
    mockSetLines = jest.fn();
    mockContext = {
      setLines: mockSetLines,
      commandHistory: [],
      lines: [],
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('입력 검증', () => {
    test('빈 입력은 false를 반환한다', () => {
      const commands: CommandRegistry = {};
      const result = executeCommand('', commands, mockContext);

      expect(result).toBe(false);
      expect(mockSetLines).not.toHaveBeenCalled();
    });

    test('공백만 있는 입력은 false를 반환한다', () => {
      const commands: CommandRegistry = {};
      const result = executeCommand('   ', commands, mockContext);

      expect(result).toBe(false);
      expect(mockSetLines).not.toHaveBeenCalled();
    });
  });

  describe('명령어 파싱', () => {
    test('명령어와 인수를 올바르게 파싱한다', () => {
      const mockHandler = jest.fn().mockReturnValue('test output');
      const commands: CommandRegistry = {
        test: mockHandler,
      };

      executeCommand('test arg1 arg2', commands, mockContext);

      expect(mockHandler).toHaveBeenCalledWith(['arg1', 'arg2'], mockContext);
    });

    test('여러 공백을 하나로 처리한다', () => {
      const mockHandler = jest.fn().mockReturnValue('test output');
      const commands: CommandRegistry = {
        test: mockHandler,
      };

      executeCommand('test  arg1   arg2', commands, mockContext);

      expect(mockHandler).toHaveBeenCalledWith(['arg1', 'arg2'], mockContext);
    });
  });

  describe('입력 라인 추가', () => {
    test('입력 라인을 터미널에 추가한다', () => {
      const mockHandler = jest.fn().mockReturnValue('output');
      const commands: CommandRegistry = {
        test: mockHandler,
      };

      executeCommand('test', commands, mockContext);

      expect(mockSetLines).toHaveBeenCalledWith(expect.any(Function));
      const updater = mockSetLines.mock.calls[0][0];
      const result = updater([]);
      expect(result).toEqual([{ type: 'input', content: 'test' }]);
    });
  });

  describe('알 수 없는 명령어', () => {
    test('알 수 없는 명령어는 에러 메시지를 추가한다', () => {
      const commands: CommandRegistry = {};
      const result = executeCommand('unknown', commands, mockContext);

      expect(result).toBe(false);
      expect(mockSetLines).toHaveBeenCalledTimes(2); // 입력 라인 + 에러 메시지

      const errorCall = mockSetLines.mock.calls[1][0];
      const errorResult = errorCall([]);
      expect(errorResult).toEqual([
        {
          type: 'whisper',
          content:
            'unknown는 아직 피어나지 않은 씨앗입니다. help를 속삭여보세요.',
        },
      ]);
    });
  });

  describe('명령어 실행 결과 처리', () => {
    test('string 반환 시 output으로 처리한다', () => {
      const mockHandler = jest.fn().mockReturnValue('test output');
      const commands: CommandRegistry = {
        test: mockHandler,
      };

      executeCommand('test', commands, mockContext);

      expect(mockSetLines).toHaveBeenCalledTimes(2); // 입력 라인 + 출력 라인
      const outputCall = mockSetLines.mock.calls[1][0];
      const outputResult = outputCall([]);
      expect(outputResult).toEqual([
        { type: 'output', content: 'test output' },
      ]);
    });

    test('CommandResult 객체 반환 시 올바르게 처리한다', () => {
      const mockHandler = jest.fn().mockReturnValue({ output: 'test' });
      const commands: CommandRegistry = {
        test: mockHandler,
      };

      executeCommand('test', commands, mockContext);

      expect(mockSetLines).toHaveBeenCalledTimes(2);
      const outputCall = mockSetLines.mock.calls[1][0];
      const outputResult = outputCall([]);
      expect(outputResult).toEqual([{ type: 'output', content: 'test' }]);
    });

    test('clear가 true이면 화면을 지운다', () => {
      const mockHandler = jest.fn().mockReturnValue({ clear: true });
      const commands: CommandRegistry = {
        test: mockHandler,
      };

      executeCommand('test', commands, mockContext);

      // clear 호출 확인
      const clearCall = mockSetLines.mock.calls.find((call) => {
        const updater = call[0];
        return updater([{ type: 'output', content: 'old' }]).length === 0;
      });
      expect(clearCall).toBeDefined();
    });

    test('error가 있으면 에러 라인을 추가한다', () => {
      const mockHandler = jest.fn().mockReturnValue({
        error: 'test error',
      });
      const commands: CommandRegistry = {
        test: mockHandler,
      };

      executeCommand('test', commands, mockContext);

      const errorCall = mockSetLines.mock.calls.find((call) => {
        const updater = call[0];
        const result = updater([]);
        return result.some((line: TerminalLine) => line.type === 'error');
      });
      expect(errorCall).toBeDefined();
    });

    test('void 반환 시 아무것도 추가하지 않는다', () => {
      const mockHandler = jest.fn().mockReturnValue(undefined);
      const commands: CommandRegistry = {
        test: mockHandler,
      };

      executeCommand('test', commands, mockContext);

      // 입력 라인만 추가됨
      expect(mockSetLines).toHaveBeenCalledTimes(1);
    });
  });

  describe('에러 처리', () => {
    test('명령어 실행 중 에러 발생 시 에러 메시지를 추가한다', () => {
      const mockHandler = jest.fn().mockImplementation(() => {
        throw new Error('test error');
      });
      const commands: CommandRegistry = {
        test: mockHandler,
      };

      const result = executeCommand('test', commands, mockContext);

      expect(result).toBe(false);
      const errorCall = mockSetLines.mock.calls.find((call) => {
        const updater = call[0];
        const result = updater([]);
        return result.some((line: TerminalLine) => line.type === 'error');
      });
      expect(errorCall).toBeDefined();
    });

    test('에러가 Error 인스턴스가 아니면 기본 메시지를 사용한다', () => {
      const mockHandler = jest.fn().mockImplementation(() => {
        throw 'string error';
      });
      const commands: CommandRegistry = {
        test: mockHandler,
      };

      executeCommand('test', commands, mockContext);

      const errorCall = mockSetLines.mock.calls.find((call) => {
        const updater = call[0];
        const result = updater([]);
        return result.some(
          (line: TerminalLine) =>
            line.type === 'error' &&
            line.content === '예상치 못한 순간이 찾아왔습니다.'
        );
      });
      expect(errorCall).toBeDefined();
    });
  });
});
