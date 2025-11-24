import type { CommandHandler } from '@web/commands/types.js';
import { runSource } from '@app/run/runner.js';

const MINT_EXAMPLES = [
  'sparkle "hello, mint!"',
  'plant feeling = "gentle"\nsparkle feeling',
  'bloom (count < 3) softly {\n  sparkle count\n  plant count = count + 1\n}',
  'breeze (true) softly {\n  sparkle "the breeze whispers softly"\n}',
  'petal greet(name) {\n  sparkle "hello, " + name\n}',
];

/**
 * MINT 코드를 실행합니다.
 * @param args - 명령어 인수
 * @returns 실행 결과 또는 오류 메시지
 */
export const mint: CommandHandler = (args) => {
  if (args.length === 0) {
    return {
      error: '무엇을 속삭이고 싶으신가요?\n예: mint "plant x = 1 + 2"',
    };
  }

  const code = args.join(' ');
  const result = runSource(code, { filename: '<terminal>' });

  if (!result.ok) {
    const hint = result.error.hint ? `\n  Hint: ${result.error.hint}` : '';

    return {
      error: `🔥 ${result.error.message}${hint}`,
    };
  }

  if (result.stdout.length === 0) {
    return '코드가 조용히 흐릅니다. 출력은 없지만 실행되었습니다.';
  }

  return result.stdout.join('\n');
};

/**
 * 메시지를 속삭입니다.
 * @param args - 명령어 인수
 * @returns 속삭이기 결과 또는 오류 메시지
 */
export const whisper: CommandHandler = (args) => {
  const message = args.join(' ');
  if (!message) {
    return '무엇을 속삭이고 싶으신가요?\n예: whisper "peace and calm"';
  }
  return `🌙 속삭임: ${message}\n   ... 메시지가 부드럽게 흐릅니다 ...`;
};

/**
 * MINT 예제를 보여줍니다.
 * @returns MINT 예제
 */
export const example: CommandHandler = () => {
  const example =
    MINT_EXAMPLES[Math.floor(Math.random() * MINT_EXAMPLES.length)];
  return `✨ MINT 예제:\n\n  ${example}\n\nmint는 이렇게 부드럽게 표현합니다.`;
};

/**
 * MINT 언어에 대해 소개합니다.
 * @returns MINT 언어 소개
 */
export const about: CommandHandler = () => {
  return `🌿 MINT - A soft-spoken language
  
  MINT는 삶, 감정, 흐름을 표현하기 위한 부드러운 언어입니다.
  코드를 작성하는 것이 아니라, 속삭이는 것입니다.
  
  철학:
  • 강제하지 않고 제안합니다
  • 명령하지 않고 초대합니다  
  • 실행하지 않고 흐릅니다
  
  "Code is poetry, but MINT is a gentle whisper."`;
};
