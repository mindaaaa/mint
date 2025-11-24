import type { CommandHandler } from '@web/commands/types.js';
import { FileSystemStore } from '@web/commands/store/FileSystem.js';

/**
 * 파일 내용을 출력합니다.
 * @param args - 파일명
 * @returns 파일 내용 또는 오류 메시지
 */
export const cat: CommandHandler = (args) => {
  if (args.length === 0) {
    return {
      error: '파일명을 속삭여주세요.\n예: cat hello.mint',
    };
  }

  const path = args[0];
  const content = FileSystemStore.read(path);

  if (content === null) {
    return {
      error: `"${path}"는 아직 피어나지 않은 씨앗입니다.`,
    };
  }

  return content;
};

/**
 * 파일 목록을 출력합니다.
 * @param args - 디렉토리명
 * @returns 파일 목록 또는 오류 메시지
 */
export const ls: CommandHandler = (args) => {
  const directory = args[0];
  const files = FileSystemStore.list(directory);

  if (files.length === 0) {
    return directory
      ? `"${directory}"에는 아직 숨겨진 씨앗이 없습니다.`
      : '아직 숨겨진 씨앗이 없습니다.';
  }

  return files.join('\n');
};
