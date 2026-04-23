import type { RunResult } from '@app/run/runner.js';
import type { MintError } from '@app/run/errors.js';

export interface BloomBodyProps {
  result: RunResult | null;
  running: boolean;
  duration?: number | null;
}

function iconForOrigin(origin: MintError['origin']): string {
  switch (origin) {
    case 'LEXER':
      return '🍃';
    case 'PARSER':
      return '🍁';
    case 'EVALUATOR':
      return '🔥';
    case 'CLI':
      return '🍂';
    default:
      return '🍂';
  }
}

function isShortGlyphLine(line: string): boolean {
  const trimmed = line.trim();
  return [...trimmed].length <= 4 && trimmed.length > 0;
}

export function BloomBody({ result, running, duration }: BloomBodyProps) {
  if (running) {
    return (
      <div className="px-5 py-5 font-serif italic text-[13.5px] text-workbench-ink-soft">
        조용히 피어나는 중이에요…
      </div>
    );
  }
  if (!result) {
    return (
      <div className="px-5 py-8 font-serif italic text-[13px] text-workbench-ink-mute leading-[1.75]">
        <div className="font-mono not-italic text-[10.5px] tracking-[2px] uppercase text-workbench-ink-faint mb-2">
          empty field
        </div>
        상단의 <span className="font-mono not-italic text-workbench-green-deep">▸ bloom</span>을
        누르면,
        <br />
        이곳에 피어난 결과가 내려앉아요.
      </div>
    );
  }
  if (result.ok) {
    return <SuccessBlock stdout={result.stdout} duration={duration} />;
  }
  return <ErrorBlock error={result.error} />;
}

function SuccessBlock({
  stdout,
  duration,
}: {
  stdout: readonly string[];
  duration: number | null | undefined;
}) {
  const durationText =
    duration != null ? ` · ${(duration / 1000).toFixed(2)}s` : '';
  return (
    <div className="px-5 py-5">
      <div className="font-mono text-[10.5px] tracking-[1.8px] uppercase text-workbench-green-deep mb-3 flex items-center gap-2">
        <span className="inline-block w-[6px] h-[6px] rounded-full bg-workbench-green" />
        bloomed{durationText}
      </div>

      {stdout.length === 0 ? (
        <div className="font-serif italic text-[13px] text-workbench-ink-mute leading-[1.7]">
          조용히 흐르는 코드였어요. 출력은 없어요.
        </div>
      ) : (
        <div className="flex flex-col gap-[6px]">
          {stdout.map((line, i) => (
            <div
              key={i}
              className="text-workbench-ink whitespace-pre-wrap break-words leading-[1.4] font-mono"
              style={{
                fontSize: isShortGlyphLine(line) ? '26px' : '13px',
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ErrorBlock({ error }: { error: MintError }) {
  const icon = iconForOrigin(error.origin);
  return (
    <div className="px-5 py-5">
      <div className="font-mono text-[10.5px] tracking-[1.8px] uppercase text-workbench-clay mb-3 flex items-center gap-2">
        <span className="inline-block w-[6px] h-[6px] rounded-full bg-workbench-clay" />
        fallen · {error.label.toLowerCase()}
      </div>
      <div className="p-4 border border-[#E6D2C2] bg-[#FAF2EA] rounded-md">
        <div className="flex items-start gap-[10px]">
          <span className="text-[20px] flex-shrink-0 leading-none mt-[-1px]">
            {icon}
          </span>
          <div className="flex-1 min-w-0">
            <pre className="font-mono text-[12px] text-workbench-clay leading-[1.7] whitespace-pre-wrap break-words m-0">
              {error.message}
            </pre>
            {error.hint && (
              <div className="font-serif italic text-[12.5px] text-workbench-ink-soft leading-[1.6] mt-2">
                <span className="font-medium not-italic text-workbench-clay">
                  hint —{' '}
                </span>
                {error.hint}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
