import { formatMintError, formatSuccess } from '@app/run/formatter.js';
import type { MintError } from '@app/run/errors.js';
import { logger } from '@app/utils/logger.js';

/**
 * 실행 결과를 콘솔에 출력한다.
 *
 * @param stdout 평가기에서 수집된 stdout 버퍼
 */
export function printSuccess(stdout: string[]): void {
  const formatted = formatSuccess(stdout);

  logger.success(formatted.headline);
  formatted.body.forEach((line) => logger.plain(line));
}

/**x
 * 실행 중 발생한 에러를 콘솔에 출력한다.
 *
 * @param error MintError 인스턴스
 */
export function printError(error: MintError): void {
  const formatted = formatMintError(error);

  logger.error(formatted.headline);
  formatted.details.forEach((detail) => logger.error(detail));

  if (formatted.hint) {
    logger.warn(formatted.hint);
  }
}

/**
 * CLI 사용법을 출력한다.
 */
export function printUsage(): void {
  logger.info('Usage: mint <command> [options]');
  logger.plain('  run <file>     지정된 .mint 파일을 실행합니다.');
  logger.plain('  version        CLI 버전을 출력합니다.');
}
