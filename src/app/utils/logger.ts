const RESET = '\u001b[0m';
const COLORS = {
  success: '\u001b[32m',
  info: '\u001b[36m',
  warn: '\u001b[33m',
  error: '\u001b[31m',
};

export interface Logger {
  info(message: string): void /* 정보 메시지 */;
  success(message: string): void /* 성공 메시지 */;
  warn(message: string): void /* 경고 메시지 */;
  error(message: string): void /* 에러 메시지 */;
  plain(message: string): void /* 일반 메시지 */;
}

/**
 * CLI 출력을 담당하는 기본 로거 객체를 생성한다.
 */
export const logger: Logger = {
  info(message: string) {
    write(colorize(COLORS.info, message));
  },
  success(message: string) {
    write(colorize(COLORS.success, message));
  },
  warn(message: string) {
    write(colorize(COLORS.warn, message));
  },
  error(message: string) {
    writeError(colorize(COLORS.error, message));
  },
  plain(message: string) {
    write(message);
  },
};

function write(message: string): void {
  process.stdout.write(`${message}\n`);
}

function writeError(message: string): void {
  process.stderr.write(`${message}\n`);
}

/**
 * ANSI 컬러를 적용한 메시지를 생성한다.
 *
 * @param color ANSI 컬러 코드
 * @param message 메시지
 * @returns 컬러 문자열
 */
function colorize(color: string, message: string): string {
  return `${color}${message}${RESET}`;
}
