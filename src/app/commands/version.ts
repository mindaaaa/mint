import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

interface PackageMetadata {
  name?: string;
  version?: string;
}

export interface VersionInfo {
  name: string;
  version: string;
}

/**
 * package.json 정보를 읽어 CLI 버전을 반환한다.
 *
 * @returns 패키지 이름과 버전 정보
 */
export function getVersionInfo(): VersionInfo {
  const packageJsonPath = '../../../package.json';
  const metadata = require(packageJsonPath) as PackageMetadata;
  const name = metadata.name ?? 'mint-lang';
  const version = metadata.version ?? '0.0.0';

  return { name, version };
}

/**
 * 버전 정보를 사람이 읽을 수 있는 문자열로 변환한다.
 *
 * @param info 버전 정보
 * @returns 포맷된 문자열
 */
export function formatVersionMessage(info: VersionInfo): string {
  return `${info.name} v${info.version}`;
}
