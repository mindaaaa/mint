const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

import { FileSystemStore } from '@web/commands/store/FileSystem.js';

describe('FileSystemStore', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  describe('init', () => {
    test('기본 파일들을 생성한다', () => {
      mockLocalStorage.clear();
      jest.clearAllMocks();
      FileSystemStore.init();

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      const calls = mockLocalStorage.setItem.mock.calls.filter(
        (call) => call[0] === 'mint-filesystem'
      );
      expect(calls.length).toBeGreaterThan(0);
      const lastCall = calls[calls.length - 1];
      const files = JSON.parse(lastCall[1]);
      expect(files['hello.mint']).toBeDefined();
      expect(files['README.md']).toBeDefined();
    });

    test('이미 파일이 있으면 초기화하지 않는다', () => {
      mockLocalStorage.setItem('mint-filesystem', JSON.stringify({}));
      jest.clearAllMocks();

      FileSystemStore.init();

      const initCalls = mockLocalStorage.setItem.mock.calls.filter(
        (call) => call[0] === 'mint-filesystem'
      );
      expect(initCalls.length).toBe(0);
    });
  });

  describe('read', () => {
    test('파일을 읽는다', () => {
      const files = { 'test.mint': 'test content' };
      mockLocalStorage.setItem('mint-filesystem', JSON.stringify(files));

      const result = FileSystemStore.read('test.mint');

      expect(result).toBe('test content');
    });

    test('파일이 없으면 null을 반환한다', () => {
      mockLocalStorage.setItem('mint-filesystem', JSON.stringify({}));

      const result = FileSystemStore.read('nonexistent.mint');

      expect(result).toBeNull();
    });
  });

  describe('write', () => {
    test('파일을 쓴다', () => {
      mockLocalStorage.setItem('mint-filesystem', JSON.stringify({}));
      jest.clearAllMocks();

      FileSystemStore.write('test.mint', 'test content');

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      const calls = mockLocalStorage.setItem.mock.calls.filter(
        (call) => call[0] === 'mint-filesystem'
      );
      expect(calls.length).toBeGreaterThan(0);
      const lastCall = calls[calls.length - 1];
      const files = JSON.parse(lastCall[1]);
      expect(files['test.mint']).toBe('test content');
    });

    test('기존 파일을 덮어쓴다', () => {
      const files = { 'test.mint': 'old content' };
      mockLocalStorage.setItem('mint-filesystem', JSON.stringify(files));
      jest.clearAllMocks();

      FileSystemStore.write('test.mint', 'new content');

      const calls = mockLocalStorage.setItem.mock.calls.filter(
        (call) => call[0] === 'mint-filesystem'
      );
      expect(calls.length).toBeGreaterThan(0);
      const lastCall = calls[calls.length - 1];
      const updatedFiles = JSON.parse(lastCall[1]);
      expect(updatedFiles['test.mint']).toBe('new content');
    });
  });

  describe('list', () => {
    test('모든 파일 목록을 반환한다', () => {
      const files = {
        'file1.mint': 'content1',
        'file2.mint': 'content2',
        'README.md': 'readme',
      };
      mockLocalStorage.setItem('mint-filesystem', JSON.stringify(files));

      const result = FileSystemStore.list();

      expect(result).toHaveLength(3);
      expect(result).toContain('file1.mint');
      expect(result).toContain('file2.mint');
      expect(result).toContain('README.md');
    });

    test('디렉토리 필터링이 동작한다', () => {
      const files = {
        'dir1/file1.mint': 'content1',
        'dir1/file2.mint': 'content2',
        'dir2/file3.mint': 'content3',
      };
      mockLocalStorage.setItem('mint-filesystem', JSON.stringify(files));

      const result = FileSystemStore.list('dir1');

      expect(result).toHaveLength(2);
      expect(result).toContain('dir1/file1.mint');
      expect(result).toContain('dir1/file2.mint');
      expect(result).not.toContain('dir2/file3.mint');
    });

    test('파일이 없으면 빈 배열을 반환한다', () => {
      mockLocalStorage.setItem('mint-filesystem', JSON.stringify({}));

      const result = FileSystemStore.list();

      expect(result).toEqual([]);
    });
  });
});
