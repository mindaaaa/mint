import type { CommandRegistry } from './types.js';
import * as system from './handlers/system.js';
import * as fileSystem from './handlers/fileSystem.js';
import * as mint from './handlers/mint.js';

/**
 * 명령어 레지스트리를 생성합니다.
 * @returns 명령어 레지스트리
 */
export const commands: CommandRegistry = {
  /* 시스템 명령어 */
  help: system.help,
  clear: system.clear,
  echo: system.echo,
  date: system.date,
  history: system.history,
  version: system.version,

  /* 파일시스템 명령어 */
  cat: fileSystem.cat,
  ls: fileSystem.ls,

  /* MINT 명령어 */
  mint: mint.mint,
  whisper: mint.whisper,
  example: mint.example,
  about: mint.about,
};
