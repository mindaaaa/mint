import { cat, ls } from '@web/commands/handlers/fileSystem.js';
import { FileSystemStore } from '@web/commands/store/FileSystem.js';
import type { CommandContext } from '@web/commands/types.js';

jest.mock('@web/commands/store/FileSystem.js', () => ({
  FileSystemStore: {
    read: jest.fn(),
    list: jest.fn(),
  },
}));

describe('fileSystem commands', () => {
  let mockContext: CommandContext;

  beforeEach(() => {
    mockContext = {
      setLines: jest.fn(),
      commandHistory: [],
      lines: [],
    };
    jest.clearAllMocks();
  });

  describe('cat', () => {
    test('파일 내용을 반환한다', () => {
      (FileSystemStore.read as jest.Mock).mockReturnValue('file content');

      const result = cat(['test.mint'], mockContext);

      expect(FileSystemStore.read).toHaveBeenCalledWith('test.mint');
      expect(result).toBe('file content');
    });

    test('파일명이 없으면 에러를 반환한다', () => {
      const result = cat([], mockContext);

      expect(result).toEqual({
        error: '파일명을 속삭여주세요.\n예: cat hello.mint',
      });
      expect(FileSystemStore.read).not.toHaveBeenCalled();
    });

    test('파일이 없으면 에러를 반환한다', () => {
      (FileSystemStore.read as jest.Mock).mockReturnValue(null);

      const result = cat(['nonexistent.mint'], mockContext);

      expect(result).toEqual({
        error: '"nonexistent.mint"는 아직 피어나지 않은 씨앗입니다.',
      });
    });
  });

  describe('ls', () => {
    test('파일 목록을 반환한다', () => {
      (FileSystemStore.list as jest.Mock).mockReturnValue([
        'file1.mint',
        'file2.mint',
      ]);

      const result = ls([], mockContext);

      expect(FileSystemStore.list).toHaveBeenCalledWith(undefined);
      expect(result).toBe('file1.mint\nfile2.mint');
    });

    test('디렉토리 필터링이 동작한다', () => {
      (FileSystemStore.list as jest.Mock).mockReturnValue(['dir/file.mint']);

      const result = ls(['dir'], mockContext);

      expect(FileSystemStore.list).toHaveBeenCalledWith('dir');
      expect(result).toBe('dir/file.mint');
    });

    test('파일이 없으면 메시지를 반환한다', () => {
      (FileSystemStore.list as jest.Mock).mockReturnValue([]);

      const result = ls([], mockContext);

      expect(result).toBe('아직 숨겨진 씨앗이 없습니다.');
    });

    test('디렉토리에 파일이 없으면 메시지를 반환한다', () => {
      (FileSystemStore.list as jest.Mock).mockReturnValue([]);

      const result = ls(['dir'], mockContext);

      expect(result).toBe('"dir"에는 아직 숨겨진 씨앗이 없습니다.');
    });
  });
});
