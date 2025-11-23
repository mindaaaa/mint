import type {
  CommandContext,
  CommandResult,
  CommandRegistry,
} from './types.js';

/**
 * 명령어 실행 결과를 CommandResult로 정규화한다.
 * @param result - 명령어 실행 결과
 * @returns 정규화된 결과
 */
function normalizeResult(
  result: CommandResult | string | void
): CommandResult | null {
  if (typeof result === 'string') {
    return { output: result };
  }
  if (result && typeof result === 'object') {
    return result;
  }
  return null;
}

/**
 * 입력 문자열을 파싱하여 명령어와 인수를 분리한 후, 명령어 실행을 시도한다.
 * @param input - 입력 문자열
 * @param commands - 명령어 레지스트리
 * @param context - 명령어 실행 컨텍스트
 * @returns 명령어 실행 결과
 * @throws 명령어 실행 중 발생한 오류
 */
export function executeCommand(
  input: string,
  commands: CommandRegistry,
  context: CommandContext
): boolean {
  const parsed = parseCommand(input);
  if (!parsed) {
    return false;
  }

  const { command, args } = parsed;

  addInputLine(input.trim(), context);

  const handler = commands[command];
  if (!handler) {
    addUnknownCommandError(command, context);
    return false;
  }

  try {
    const result = handler(args, context);
    const normalizedResult = normalizeResult(result);

    if (normalizedResult) {
      applyCommandResult(normalizedResult, context);
    }

    return true;
  } catch (e) {
    addExecutionError(e, context);
    return false;
  }
}

/**
 * 입력 문자열을 파싱하여 명령어와 인수를 분리한다.
 * @param input - 입력 문자열
 * @returns 명령어와 인수를 분리한 객체, 또는 null
 */
function parseCommand(
  input: string
): { command: string; args: string[] } | null {
  const trimmedInput = input.trim();
  if (!trimmedInput) {
    return null;
  }

  const [command, ...args] = trimmedInput.split(/\s+/);
  return { command, args: args.filter((arg) => arg !== '') };
}

/**
 * 입력 문자열을 터미널 라인 배열에 추가한다.
 * @param input - 입력 문자열
 * @param context - 명령어 실행 컨텍스트
 */
function addInputLine(input: string, context: CommandContext): void {
  context.setLiens((prev) => [...prev, { type: 'input', content: input }]);
}

/**
 * 알 수 없는 명령어에 대한 오류 메시지를 추가한다.
 * @param command - 알 수 없는 명령어
 * @param context - 명령어 실행 컨텍스트
 */
function addUnknownCommandError(
  command: string,
  context: CommandContext
): void {
  context.setLiens((prev) => [
    ...prev,
    {
      type: 'whisper',
      content: `${command}는 아직 피어나지 않은 씨앗입니다. help를 속삭여보세요.`,
    },
  ]);
}

/**
 * 명령어 실행 결과를 터미널 라인 배열에 적용한다.
 * @param result - 명령어 실행 결과
 * @param context - 명령어 실행 컨텍스트
 */
function applyCommandResult(
  result: CommandResult,
  context: CommandContext
): void {
  if (result.clear) {
    applyClearResult(result, context);
  } else {
    applyNormalResult(result, context);
  }
}

/**
 * clear가 true인 경우 결과를 적용한다.
 * @param result - 명령어 실행 결과
 * @param context - 명령어 실행 컨텍스트
 */
function applyClearResult(
  result: CommandResult,
  context: CommandContext
): void {
  clearTerminal(context);

  if (result.output) {
    addOutputLine(result.output, context);
  }

  if (result.error) {
    addErrorLine(result.error, context);
  }
}

/**
 * clear가 false인 경우 결과를 적용한다.
 * @param result - 명령어 실행 결과
 * @param context - 명령어 실행 컨텍스트
 */
function applyNormalResult(
  result: CommandResult,
  context: CommandContext
): void {
  if (result.output) {
    addOutputLine(result.output, context);
  }

  if (result.error) {
    addErrorLine(result.error, context);
  }
}

/**
 * 터미널 화면을 지운다.
 * @param context - 명령어 실행 컨텍스트
 */
function clearTerminal(context: CommandContext): void {
  context.setLiens(() => []);
}

/**
 * 출력 라인을 터미널에 추가한다.
 * @param output - 출력 내용
 * @param context - 명령어 실행 컨텍스트
 */
function addOutputLine(output: string, context: CommandContext): void {
  const trimmedOutput = output.trim();
  if (!trimmedOutput) {
    return;
  }
  context.setLiens((prev) => [
    ...prev,
    { type: 'output', content: trimmedOutput },
  ]);
}

/**
 * 에러 라인을 터미널에 추가한다.
 * @param error - 에러 내용
 * @param context - 명령어 실행 컨텍스트
 */
function addErrorLine(error: string, context: CommandContext): void {
  const trimmedError = error.trim();
  if (!trimmedError) {
    return;
  }
  context.setLiens((prev) => [
    ...prev,
    { type: 'error', content: trimmedError },
  ]);
}

/**
 * 명령어 실행 중 발생한 오류를 추가한다.
 * @param e - 오류 객체 또는 메시지
 * @param context - 명령어 실행 컨텍스트
 */
function addExecutionError(e: unknown, context: CommandContext): void {
  const errorMessage =
    e instanceof Error ? e.message : '예상치 못한 순간이 찾아왔습니다.';
  context.setLiens((prev) => [
    ...prev,
    { type: 'error', content: errorMessage },
  ]);
}
