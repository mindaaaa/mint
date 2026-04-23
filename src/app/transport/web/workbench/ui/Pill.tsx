import type { ReactNode } from 'react';

export type PillTone = 'neutral' | 'growing' | 'bloom' | 'leaf';

export interface PillProps {
  children: ReactNode;
  tone?: PillTone;
  className?: string;
}

const TONE_CLASS: Record<PillTone, string> = {
  neutral:
    'bg-workbench-soft text-workbench-ink-soft border-workbench-rule',
  growing:
    'bg-[#E8EFE4] text-workbench-green-deep border-[#C8D9C3]',
  bloom:
    'bg-[#F3E8D5] text-workbench-amber border-[#E0CFA8]',
  leaf:
    'bg-[#F0DDD0] text-workbench-clay border-[#D9BFA8]',
};

export function Pill({ children, tone = 'neutral', className = '' }: PillProps) {
  return (
    <span
      className={`inline-flex items-center font-mono text-[10.5px] tracking-[0.4px] px-2 py-[2px] rounded-full border leading-[1.5] ${TONE_CLASS[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
