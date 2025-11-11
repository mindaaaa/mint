import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, relative, extname } from 'node:path';

export type FileSystemErrorCode =
  | 'FILE_NOT_FOUND'
  | 'NOT_A_FILE'
  | 'INVALID_EXTENSION'
  | 'READ_FAILED';

export interface ReadFileOptions {
  encoding?: BufferEncoding;
  expectedExtension?: string;
}

/**
 * 사용자 입력 경로를 절대 경로로 변환한다.
 *
 * @param input 사용자가 전달한 경로
 * @returns 절대 경로
 */
export function resolveFilePath(input: string): string {
  return resolve(process.cwd(), input);
}

/**
 * 절대 경로를 현재 작업 디렉터리 기준 상대 경로로 변환한다.
 *
 * @param filePath 변환할 경로
 * @returns 상대 경로 문자열
 */
export function toProjectRelativePath(filePath: string): string {
  const relativePath = relative(process.cwd(), filePath);
  return relativePath === '' ? '.' : relativePath;
}

/**
 * 지정된 경로의 파일을 읽어 문자열로 반환한다.
 *
 * @param filePath 읽을 파일 경로
 * @param options 읽기 옵션
 * @returns 파일 내용
 */
export function readFileContent(
  filePath: string,
  options: ReadFileOptions = {}
): string {
  try {
    const encoding = options.encoding ?? 'utf8';
    validateFilePath(filePath, options.expectedExtension);
    return readFileSync(filePath, { encoding });
  } catch (error) {
    if (error instanceof FileSystemError) {
      throw error;
    }

    throw new FileSystemError(
      `파일을 읽는 중 문제가 발생했습니다: ${toProjectRelativePath(filePath)}`,
      'READ_FAILED',
      error
    );
  }
}

/**
 * 파일 경로가 유효한지 검사하고 필요한 경우 예외를 던진다.
 *
 * @param filePath 검사할 파일 경로
 * @param expectedExtension 기대하는 파일 확장자 (예: `.mint`)
 */
function validateFilePath(filePath: string, expectedExtension?: string): void {
  const displayPath = toProjectRelativePath(filePath);

  if (!existsSync(filePath)) {
    throw new FileSystemError(
      `파일을 찾을 수 없습니다: ${displayPath}`,
      'FILE_NOT_FOUND'
    );
  }

  const stats = statSync(filePath);

  if (!stats.isFile()) {
    throw new FileSystemError(
      `파일이 아닌 경로입니다: ${displayPath}`,
      'NOT_A_FILE'
    );
  }

  const hasUnexpectedExtension =
    expectedExtension &&
    extname(filePath).toLowerCase() !== expectedExtension.toLowerCase();

  if (hasUnexpectedExtension) {
    throw new FileSystemError(
      `지원하지 않는 확장자입니다: ${displayPath}`,
      'INVALID_EXTENSION'
    );
  }
}

/**
 * 파일 시스템 관련 오류를 표현한다.
 */
export class FileSystemError extends Error {
  public readonly code: FileSystemErrorCode;

  constructor(message: string, code: FileSystemErrorCode, cause?: unknown) {
    super(message);
    this.name = 'FileSystemError';
    this.code = code;
    if (cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = cause;
    }
  }
}
