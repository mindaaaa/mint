import type { CommandHandler } from '@web/commands/types.js';

const VERSION_INFO = {
  name: 'mint',
  version: '1.0.0',
};

export const help: CommandHandler = () => {
  return `✨ MINT 명령어:
  mint       - MINT 코드 실행
  whisper    - 메시지 속삭이기
  example    - 예제 보기
  about      - MINT 소개
  
기본 명령어:
  help       - 도움말 표시
  clear      - 화면 지우기
  echo       - 텍스트 출력
  date       - 현재 날짜와 시간
  history    - 명령어 기록
  version    - 버전 정보
  cat        - 파일 읽기
  ls         - 파일 목록`;
};

export const clear: CommandHandler = () => {
  return { clear: true };
};

export const echo: CommandHandler = (args) => {
  return { output: args.join(' ') };
};

export const date: CommandHandler = () => {
  return new Date().toLocaleString('ko-KR');
};

export const history: CommandHandler = (args, context) => {
  const { commandHistory } = context;

  if (commandHistory.length === 0) {
    return '아직 기록된 부름이 없었습니다.';
  }

  return commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`).join('\n');
};

export const version: CommandHandler = () => {
  return `${VERSION_INFO.name} v${VERSION_INFO.version}`;
};
