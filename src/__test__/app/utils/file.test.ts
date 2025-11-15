import {
  FileSystemError,
  readFileContent,
  resolveFilePath,
  toProjectRelativePath,
} from '@app/utils/file.js';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, relative } from 'node:path';

jest.mock('node:fs', () => ({
  readFileSync: jest.fn(),
  existsSync: jest.fn(),
  statSync: jest.fn(),
}));

describe('file utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('resolveFilePath', () => {
    test('상대 경로를 절대 경로로 변환한다', () => {
      // Given
      const input = 'test.mint';
      const cwd = process.cwd();

      // When
      const result = resolveFilePath(input);

      // Then
      expect(result).toBe(resolve(cwd, input));
    });

    test('절대 경로는 그대로 반환한다', () => {
      // Given
      const input = '/absolute/path/test.mint';

      // When
      const result = resolveFilePath(input);

      // Then
      expect(result).toBe(input);
    });
  });

  describe('toProjectRelativePath', () => {
    test('절대 경로를 상대 경로로 변환한다', () => {
      // Given
      const cwd = process.cwd();
      const filePath = resolve(cwd, 'src/test.mint');

      // When
      const result = toProjectRelativePath(filePath);

      // Then
      expect(result).toBe(relative(process.cwd(), filePath));
    });

    test('현재 작업 디렉터리와 같은 경로는 "."를 반환한다', () => {
      // Given
      const filePath = process.cwd();

      // When
      const result = toProjectRelativePath(filePath);

      // Then
      expect(result).toBe('.');
    });
  });

  describe('readFileContent', () => {
    test('파일을 읽어 내용을 반환한다', () => {
      // Given
      const filePath = '/test/project/test.mint';
      const content = 'sparkle "hello"';
      const mockReadFileSync = readFileSync as jest.MockedFunction<
        typeof readFileSync
      >;
      const mockExistsSync = existsSync as jest.MockedFunction<
        typeof existsSync
      >;
      const mockStatSync = statSync as jest.MockedFunction<typeof statSync>;

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({
        isFile: () => true,
      } as any);
      mockReadFileSync.mockReturnValue(content);

      // When
      const result = readFileContent(filePath);

      // Then
      expect(result).toBe(content);
      expect(mockReadFileSync).toHaveBeenCalledWith(filePath, {
        encoding: 'utf8',
      });
    });

    test('지정한 인코딩으로 파일을 읽는다', () => {
      // Given
      const filePath = '/test/project/test.mint';
      const content = Buffer.from('test');
      const mockReadFileSync = readFileSync as jest.MockedFunction<
        typeof readFileSync
      >;
      const mockExistsSync = existsSync as jest.MockedFunction<
        typeof existsSync
      >;
      const mockStatSync = statSync as jest.MockedFunction<typeof statSync>;

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({
        isFile: () => true,
      } as any);
      mockReadFileSync.mockReturnValue(content as any);

      // When
      const result = readFileContent(filePath, { encoding: 'utf8' });

      // Then
      expect(result).toBe(content);
      expect(mockReadFileSync).toHaveBeenCalledWith(filePath, {
        encoding: 'utf8',
      });
    });

    test('파일이 존재하지 않으면 FileSystemError를 발생시킨다', () => {
      // Given
      const filePath = '/test/project/nonexistent.mint';
      const mockExistsSync = existsSync as jest.MockedFunction<
        typeof existsSync
      >;

      mockExistsSync.mockReturnValue(false);

      // When
      const when = () => readFileContent(filePath);

      // Then
      expect(when).toThrow(FileSystemError);
      try {
        readFileContent(filePath);
      } catch (error) {
        expect(error).toBeInstanceOf(FileSystemError);
        if (error instanceof FileSystemError) {
          expect(error.code).toBe('FILE_NOT_FOUND');
        }
      }
    });

    test('디렉터리 경로면 FileSystemError를 발생시킨다', () => {
      // Given
      const filePath = '/test/project/dir';
      const mockExistsSync = existsSync as jest.MockedFunction<
        typeof existsSync
      >;
      const mockStatSync = statSync as jest.MockedFunction<typeof statSync>;

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({
        isFile: () => false,
      } as any);

      // When
      const when = () => readFileContent(filePath);

      // Then
      expect(when).toThrow(FileSystemError);
      try {
        readFileContent(filePath);
      } catch (error) {
        expect(error).toBeInstanceOf(FileSystemError);
        if (error instanceof FileSystemError) {
          expect(error.code).toBe('NOT_A_FILE');
        }
      }
    });

    test('기대한 확장자가 아니면 FileSystemError를 발생시킨다', () => {
      // Given
      const filePath = '/test/project/test.txt';
      const mockExistsSync = existsSync as jest.MockedFunction<
        typeof existsSync
      >;
      const mockStatSync = statSync as jest.MockedFunction<typeof statSync>;

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({
        isFile: () => true,
      } as any);

      // When
      const when = () =>
        readFileContent(filePath, { expectedExtension: '.mint' });

      // Then
      expect(when).toThrow(FileSystemError);
      try {
        readFileContent(filePath, { expectedExtension: '.mint' });
      } catch (error) {
        expect(error).toBeInstanceOf(FileSystemError);
        if (error instanceof FileSystemError) {
          expect(error.code).toBe('INVALID_EXTENSION');
        }
      }
    });

    test('파일 읽기 실패 시 FileSystemError를 발생시킨다', () => {
      // Given
      const filePath = '/test/project/test.mint';
      const readError = new Error('Permission denied');
      const mockReadFileSync = readFileSync as jest.MockedFunction<
        typeof readFileSync
      >;
      const mockExistsSync = existsSync as jest.MockedFunction<
        typeof existsSync
      >;
      const mockStatSync = statSync as jest.MockedFunction<typeof statSync>;

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({
        isFile: () => true,
      } as any);
      mockReadFileSync.mockImplementation(() => {
        throw readError;
      });

      // When
      const when = () => readFileContent(filePath);

      // Then
      expect(when).toThrow(FileSystemError);
      try {
        readFileContent(filePath);
      } catch (error) {
        expect(error).toBeInstanceOf(FileSystemError);
        if (error instanceof FileSystemError) {
          expect(error.code).toBe('READ_FAILED');
        }
      }
    });
  });

  describe('FileSystemError', () => {
    test('기본 에러 정보로 FileSystemError를 생성한다', () => {
      // Given
      const message = 'File not found';
      const code = 'FILE_NOT_FOUND' as const;

      // When
      const error = new FileSystemError(message, code);

      // Then
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(FileSystemError);
      expect(error.name).toBe('FileSystemError');
      expect(error.message).toBe(message);
      expect(error.code).toBe(code);
    });

    test('cause가 있는 에러를 생성한다', () => {
      // Given
      const message = 'Read failed';
      const code = 'READ_FAILED' as const;
      const cause = new Error('Permission denied');

      // When
      const error = new FileSystemError(message, code, cause);

      // Then
      expect(error).toBeInstanceOf(FileSystemError);
      expect((error as any).cause).toBe(cause);
    });

    test('다양한 에러 코드로 에러를 생성할 수 있다', () => {
      // Given
      const codes: Array<FileSystemError['code']> = [
        'FILE_NOT_FOUND',
        'NOT_A_FILE',
        'INVALID_EXTENSION',
        'READ_FAILED',
      ];

      codes.forEach((code) => {
        // When
        const error = new FileSystemError('Test', code);

        // Then
        expect(error.code).toBe(code);
      });
    });

    test('에러를 throw할 수 있다', () => {
      // Given
      const error = new FileSystemError('Test', 'FILE_NOT_FOUND');

      // When
      const when = () => {
        throw error;
      };

      // Then
      expect(when).toThrow(FileSystemError);
      expect(when).toThrow('Test');
    });
  });
});
