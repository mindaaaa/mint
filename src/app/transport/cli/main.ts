#!/usr/bin/env node
import process from 'node:process';
import { formatVersionMessage, getVersionInfo } from '@app/commands/version.js';
import { toMintError } from '@app/run/errors.js';
import { runSource } from '@app/run/runner.js';
import {
  readFileContent,
  resolveFilePath,
  toProjectRelativePath,
} from '@app/utils/file.js';
import { logger } from '@app/utils/logger.js';
import { printError, printSuccess, printUsage } from './printer.js';

/**
 * `process.argv`의 앞 두 항목(Node 실행 경로, 스크립트 경로)을 제외한 실제 사용자 입력을 담는 배열.
 */
const args = process.argv.slice(2);

/**
 * 인자가 없는 경우 사용법을 출력하고 종료한다.
 */
if (args.length === 0) {
  printUsage();
  process.exit(1);
}

const [command, ...rest] = args;

switch (command) {
  case 'run':
    executeRun(rest);
    break;
  case 'version':
    executeVersion();
    break;
  case 'help':
  case '--help':
  case '-h':
    printUsage();
    process.exit(0);
    break;
  default:
    logger.error(`알 수 없는 명령입니다: ${command}`);
    printUsage();
    process.exit(1);
}

/**
 * `mint run <파일>` 명령을 처리한다.
 *
 * @param params `run` 명령 뒤에 이어지는 인자 목록. 첫 번째 요소는 실행할 `.mint` 파일 경로여야 한다.
 */
function executeRun(params: string[]): void {
  const [fileArg] = params;

  if (!fileArg) {
    logger.error('실행할 파일 경로를 지정해야 합니다.');
    printUsage();
    process.exit(1);
  }

  const filePath = resolveFilePath(fileArg);
  const displayPath = toProjectRelativePath(filePath);

  try {
    const source = readFileContent(filePath, { expectedExtension: '.mint' });
    const result = runSource(source, { filename: displayPath });

    if (result.ok) {
      printSuccess(result.stdout);
      process.exit(0);
    }

    printError(result.error);
    process.exit(1);
  } catch (error) {
    const mintError = toMintError(error, { filePath: displayPath });
    printError(mintError);
    process.exit(1);
  }
}

/**
 * `mint version` 명령을 처리한다. 현재 CLI/런타임 버전 정보를 출력한다.
 */
function executeVersion(): void {
  const info = getVersionInfo();
  const message = formatVersionMessage(info);

  logger.plain(message);
  process.exit(0);
}
