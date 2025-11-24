/**
 * 가상 파일시스템 Store
 * localStorage를 사용하여 파일을 저장합니다.
 */
export class FileSystemStore {
  private static readonly STORAGE_KEY = 'mint-filesystem';

  /**
   * 가상 파일시스템을 초기화합니다.
   * 기본 파일들을 생성합니다.
   * @example
   * {
   *   'hello.mint': 'plant greeting = "hello, mint"\nsparkle greeting',
   *   'README.md': '# MINT Language\n\nA soft-spoken language for expressing life, feeling, and flow.',
   * }
   */
  static init(): void {
    const existing = localStorage.getItem(this.STORAGE_KEY);
    if (!existing) {
      const defaultFiles: Record<string, string> = {
        'hello.mint': 'plant greeting = "hello, mint"\nsparkle greeting',
        'README.md':
          '# MINT Language\nA soft-spoken language for expressing life, feeling, and flow.',
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultFiles));
    }
  }

  static read(path: string): string | null {
    const files = this.getAllFiles();
    return files[path] || null;
  }

  static write(path: string, content: string): void {
    const files = this.getAllFiles();
    files[path] = content;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(files));
  }

  static list(directory?: string): string[] {
    const files = this.getAllFiles();
    const fileList = Object.keys(files);

    if (!directory) {
      return fileList;
    }

    return fileList.filter((file) => file.startsWith(directory));
  }

  private static getAllFiles(): Record<string, string> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }
}

FileSystemStore.init();
