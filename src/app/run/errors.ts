import {
  formatEvaluatorError,
  formatLexerError,
  formatParserError,
} from '@core/errors/formatter.js';
import { EvaluatorError } from '@core/evaluator/errors/errors.js';
import { LexerError } from '@core/lexer/errors/errors.js';
import type { SourcePosition } from '@core/lexer/tokens.js';
import { ParserError } from '@core/parser/errors/errors.js';

export type MintErrorOrigin =
  | 'LEXER'
  | 'PARSER'
  | 'EVALUATOR'
  | 'CLI'
  | 'UNKNOWN';

export interface MintErrorContext {
  filePath?: string;
}

export interface ErrorLocation {
  file?: string;
  position?: SourcePosition;
  lexeme?: string;
}

export interface MintErrorOptions {
  origin: MintErrorOrigin;
  message: string;
  hint?: string;
  location?: ErrorLocation;
  cause?: unknown;
}

interface ErrorNormalizer<TError> {
  guard(error: unknown): error is TError;
  normalize(error: TError, context: MintErrorContext): MintError;
}

/**
 * CLI 전반에서 사용하는 표준화된 에러 표현.
 */
export class MintError extends Error {
  public readonly origin: MintErrorOrigin; /* 에러 출처 */
  public readonly hint?: string;
  public readonly location?: ErrorLocation;

  constructor(options: MintErrorOptions) {
    super(options.message);
    this.name = 'MintError';
    this.origin = options.origin;
    this.hint = options.hint;
    this.location = options.location;

    const hasCause = options.cause !== undefined;
    if (hasCause) {
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
  }

  /**
   * 에러 출처를 사람이 읽기 쉬운 라벨로 반환한다.
   */
  public get label(): string {
    switch (this.origin) {
      case 'LEXER':
        return 'Lexer Error';
      case 'PARSER':
        return 'Parser Error';
      case 'EVALUATOR':
        return 'Runtime Error';
      case 'CLI':
        return 'CLI Error';
      default:
        return 'Unknown Error';
    }
  }
}

/**
 * 주어진 에러를 MintError 형태로 정규화한다.
 *
 * @param error 변환할 에러
 * @param context 추가 컨텍스트 (파일 경로 등)
 * @returns 정규화된 MintError
 */
export function toMintError(
  error: unknown,
  context: MintErrorContext = {}
): MintError {
  if (error instanceof MintError) {
    return error;
  }

  for (const handler of errorNormalizers) {
    if (handler.guard(error)) {
      return handler.normalize(error, context);
    }
  }

  return normalizeUnknownError(error);
}

/**
 * 에러를 정규화하는 핸들러들의 배열.
 */
const errorNormalizers: ErrorNormalizer<any>[] = [
  {
    guard: isFileSystemError,
    normalize: (error) => normalizeFileSystemError(error),
  },
  {
    guard: isLexerError,
    normalize: (error, context) => normalizeLexerError(error, context),
  },
  {
    guard: isParserError,
    normalize: (error, context) => normalizeParserError(error, context),
  },
  {
    guard: isEvaluatorError,
    normalize: (error, context) => normalizeEvaluatorError(error, context),
  },
];

/**
 * FileSystemError 타입 정의 (import 없이 런타임 체크만 사용).
 */
type FileSystemErrorLike = {
  name: 'FileSystemError';
  code: 'FILE_NOT_FOUND' | 'NOT_A_FILE' | 'INVALID_EXTENSION' | 'READ_FAILED';
  message: string;
};

/**
 * 웹 환경 호환을 위한 FileSystemError 타입 검사.
 *
 * @param error FileSystemError
 * @returns FileSystemErrorLike
 */
function isFileSystemError(error: unknown): error is FileSystemErrorLike {
  return (
    error instanceof Error &&
    error.name === 'FileSystemError' &&
    'code' in error &&
    typeof (error as any).code === 'string'
  );
}

function isLexerError(error: unknown): error is LexerError {
  return error instanceof LexerError;
}

function isParserError(error: unknown): error is ParserError {
  return error instanceof ParserError;
}

function isEvaluatorError(error: unknown): error is EvaluatorError {
  return error instanceof EvaluatorError;
}

/**
 * FileSystemError를 MintError로 정규화한다.
 *
 * @param error FileSystemError
 * @returns MintError
 */
function normalizeFileSystemError(error: FileSystemErrorLike): MintError {
  const hint = (() => {
    switch (error.code) {
      case 'FILE_NOT_FOUND':
        return '경로가 정확한지 확인하고, 필요하다면 절대 경로를 전달하세요.';
      case 'NOT_A_FILE':
        return '디렉터리가 아닌 실행 가능한 파일 경로를 선택하세요.';
      case 'INVALID_EXTENSION':
        return '확장자가 .mint인지 확인한 뒤 다시 실행하세요.';
      case 'READ_FAILED':
        return '파일 권한 또는 인코딩을 확인한 뒤 다시 시도하세요.';
      default:
        return undefined;
    }
  })();

  return new MintError({
    origin: 'CLI',
    message: error.message,
    hint,
    cause: error,
  });
}

/**
 * LexerError를 MintError로 정규화한다.
 *
 * @param error LexerError
 * @param context 추가 컨텍스트 (파일 경로 등)
 * @returns MintError
 */
function normalizeLexerError(
  error: LexerError,
  context: MintErrorContext
): MintError {
  const message = formatLexerError(error);

  return new MintError({
    origin: 'LEXER',
    message,
    location: {
      file: context.filePath,
      position: error.position,
      lexeme: error.lexeme,
    },
    hint: '문제가 발생한 줄 주변의 토큰을 다시 확인해보세요.',
    cause: error,
  });
}

/**
 * ParserError를 MintError로 정규화한다.
 *
 * @param error ParserError
 * @param context 추가 컨텍스트 (파일 경로 등)
 * @returns MintError
 */
function normalizeParserError(
  error: ParserError,
  context: MintErrorContext
): MintError {
  const message = formatParserError(error);

  return new MintError({
    origin: 'PARSER',
    message,
    location: {
      file: context.filePath,
      position: error.position,
      lexeme: error.lexeme,
    },
    hint: '이전 선언이나 구문의 괄호·키워드를 점검해보세요.',
    cause: error,
  });
}

/**
 * EvaluatorError를 MintError로 정규화한다.
 *
 * @param error EvaluatorError
 * @param context 추가 컨텍스트 (파일 경로 등)
 * @returns MintError
 */
function normalizeEvaluatorError(
  error: EvaluatorError,
  context: MintErrorContext
): MintError {
  const message = formatEvaluatorError(error);

  return new MintError({
    origin: 'EVALUATOR',
    message,
    location: {
      file: context.filePath,
    },
    hint: '실행 중인 값과 타입이 예상과 일치하는지 확인하세요.',
    cause: error,
  });
}

/**
 * 알 수 없는 에러를 MintError로 정규화한다.
 *
 * @param error 알 수 없는 에러
 * @returns MintError
 */
function normalizeUnknownError(error: unknown): MintError {
  return new MintError({
    origin: 'UNKNOWN',
    message: normalizeUnknownErrorMessage(error),
    cause: error,
    hint: '버그로 의심되면 reproduction과 함께 이슈를 남겨주세요.',
  });
}

/**
 * 알 수 없는 에러 메시지를 정규화한다.
 *
 * @param error 알 수 없는 에러
 * @returns 정규화된 에러 메시지
 */
function normalizeUnknownErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message || '알 수 없는 오류가 발생했습니다.';
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error;
  }

  return '알 수 없는 오류가 발생했습니다.';
}
