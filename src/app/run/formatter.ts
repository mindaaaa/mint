import type { MintError } from './errors.js';

export interface FormattedError {
  headline: string;
  details: string[];
  hint?: string;
}

export interface FormattedResult {
  headline: string;
  body: string[];
}

/**
 * 실행 성공 시 사용자에게 보여줄 메시지를 포맷한다.
 *
 * @param stdout 실행 과정에서 수집된 출력 버퍼
 * @returns 포맷된 결과
 */
export function formatSuccess(stdout: string[]): FormattedResult {
  const body =
    stdout.length > 0 ? stdout.map((line) => `  ${line}`) : ['  (no output)'];

  return {
    headline: '🌿 Result',
    body,
  };
}

/**
 * MintError를 사용자가 읽기 좋은 형태로 변환한다.
 *
 * @param error 노출할 에러
 * @returns 포맷된 에러 메시지
 */
export function formatMintError(error: MintError): FormattedError {
  const details = [`  ${error.message}`];

  const location = formatLocation(error);
  if (location) {
    details.unshift(`  at ${location}`);
  }

  const causeDetails = formatCause(error);
  details.push(...causeDetails);

  return {
    headline: `🔥 ${error.label}`,
    details,
    hint: error.hint ? `  Hint: ${error.hint}` : undefined,
  };
}

/**
 * 에러의 원인을 포맷한다.
 *
 * @param error 노출할 에러
 * @returns 포맷된 원인 메시지
 */
function formatCause(error: MintError): string[] {
  const cause = (error as Error & { cause?: unknown }).cause;

  if (!cause || !(cause instanceof Error)) {
    return [];
  }

  if ('details' in cause && cause.details) {
    return formatCauseDetails(cause.details);
  }

  return [];
}

/**
 * 에러의 상세 정보를 포맷한다.
 *
 * @param details 상세 정보
 * @returns 포맷된 상세 정보 메시지
 */
function formatCauseDetails(details: unknown): string[] {
  return [
    '    details:',
    ...JSON.stringify(details, null, 2)
      .split('\n')
      .map((line) => `    ${line}`),
  ];
}

/**
 * 에러의 위치를 포맷한다.
 *
 * @param error 노출할 에러
 * @returns 포맷된 위치 메시지
 */
function formatLocation(error: MintError): string | undefined {
  const { location } = error;

  if (!location) {
    return undefined;
  }

  const parts: string[] = [];

  if (location.file) {
    parts.push(location.file);
  }

  if (location.position) {
    parts.push(`${location.position.line}:${location.position.column}`);
  }

  if (location.lexeme) {
    parts.push(`near \`${location.lexeme}\``);
  }

  if (parts.length === 0) {
    return undefined;
  }

  return parts.join(' ');
}
