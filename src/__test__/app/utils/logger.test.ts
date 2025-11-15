import { logger } from '@app/utils/logger.js';
import process from 'node:process';

const mockStdoutWrite = jest
  .spyOn(process.stdout, 'write')
  .mockImplementation();
const mockStderrWrite = jest
  .spyOn(process.stderr, 'write')
  .mockImplementation();

describe('logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStdoutWrite.mockClear();
    mockStderrWrite.mockClear();
  });

  afterAll(() => {
    mockStdoutWrite.mockRestore();
    mockStderrWrite.mockRestore();
  });

  describe('info', () => {
    test('정보 메시지를 stdout에 출력한다', () => {
      // Given
      const message = 'Info message';

      // When
      logger.info(message);

      // Then
      expect(mockStdoutWrite).toHaveBeenCalledTimes(1);
      expect(mockStdoutWrite).toHaveBeenCalledWith(
        expect.stringContaining(message)
      );
      // ANSI 컬러 코드가 포함되어 있는지 확인
      expect(mockStdoutWrite).toHaveBeenCalledWith(
        expect.stringMatching(/\u001b\[36m.*\u001b\[0m\n/)
      );
    });
  });

  describe('success', () => {
    test('성공 메시지를 stdout에 출력한다', () => {
      // Given
      const message = 'Success message';

      // When
      logger.success(message);

      // Then
      expect(mockStdoutWrite).toHaveBeenCalledTimes(1);
      expect(mockStdoutWrite).toHaveBeenCalledWith(
        expect.stringContaining(message)
      );
      // ANSI 컬러 코드가 포함되어 있는지 확인 (success는 녹색)
      expect(mockStdoutWrite).toHaveBeenCalledWith(
        expect.stringMatching(/\u001b\[32m.*\u001b\[0m\n/)
      );
    });
  });

  describe('warn', () => {
    test('경고 메시지를 stdout에 출력한다', () => {
      // Given
      const message = 'Warning message';

      // When
      logger.warn(message);

      // Then
      expect(mockStdoutWrite).toHaveBeenCalledTimes(1);
      expect(mockStdoutWrite).toHaveBeenCalledWith(
        expect.stringContaining(message)
      );
      // ANSI 컬러 코드가 포함되어 있는지 확인 (warn은 노란색)
      expect(mockStdoutWrite).toHaveBeenCalledWith(
        expect.stringMatching(/\u001b\[33m.*\u001b\[0m\n/)
      );
    });
  });

  describe('error', () => {
    test('에러 메시지를 stderr에 출력한다', () => {
      // Given
      const message = 'Error message';

      // When
      logger.error(message);

      // Then
      expect(mockStderrWrite).toHaveBeenCalledTimes(1);
      expect(mockStderrWrite).toHaveBeenCalledWith(
        expect.stringContaining(message)
      );
      // ANSI 컬러 코드가 포함되어 있는지 확인 (error는 빨간색)
      expect(mockStderrWrite).toHaveBeenCalledWith(
        expect.stringMatching(/\u001b\[31m.*\u001b\[0m\n/)
      );
    });
  });

  describe('plain', () => {
    test('일반 메시지를 stdout에 출력한다', () => {
      // Given
      const message = 'Plain message';

      // When
      logger.plain(message);

      // Then
      expect(mockStdoutWrite).toHaveBeenCalledTimes(1);
      expect(mockStdoutWrite).toHaveBeenCalledWith(`${message}\n`);
      // 컬러 코드가 없어야 함
      expect(mockStdoutWrite).toHaveBeenCalledWith(
        expect.not.stringMatching(/\u001b\[/)
      );
    });
  });

  describe('메시지 포맷', () => {
    test('모든 메시지는 개행 문자로 끝난다', () => {
      // Given
      const message = 'Test message';

      // When
      logger.info(message);
      logger.success(message);
      logger.warn(message);
      logger.error(message);
      logger.plain(message);

      // Then
      expect(mockStdoutWrite).toHaveBeenCalledTimes(4); // info, success, warn, plain
      expect(mockStderrWrite).toHaveBeenCalledTimes(1); // error

      const allCalls = [
        ...mockStdoutWrite.mock.calls,
        ...mockStderrWrite.mock.calls,
      ];

      allCalls.forEach((call) => {
        expect(call[0]).toMatch(/\n$/);
      });
    });

    test('컬러 메시지는 RESET 코드로 끝난다', () => {
      // Given
      const message = 'Test';

      // When
      logger.info(message);
      logger.success(message);
      logger.warn(message);
      logger.error(message);

      // Then
      const allCalls = [
        ...mockStdoutWrite.mock.calls,
        ...mockStderrWrite.mock.calls,
      ];

      allCalls.forEach((call) => {
        expect(call[0]).toMatch(/\u001b\[0m\n$/);
      });
    });
  });
});
