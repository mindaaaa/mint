import { useEffect } from 'react';

interface KeywordCheat {
  keyword: string;
  role: string;
  toneClass: string;
  label: string;
}

const CHEATS: readonly KeywordCheat[] = [
  { keyword: 'plant',   role: 'variable',  toneClass: 'text-workbench-green-deep', label: '이름을 심어요' },
  { keyword: 'sparkle', role: 'print',     toneClass: 'text-workbench-amber',      label: '소리 내어 읽어요' },
  { keyword: 'breeze',  role: 'if',        toneClass: 'text-workbench-plum',       label: '조건이 스쳐 지나가요' },
  { keyword: 'bloom',   role: 'while',     toneClass: 'text-workbench-clay',       label: '반복해 피워요' },
  { keyword: 'petal',   role: 'function',  toneClass: 'text-workbench-clay',       label: '꽃잎처럼 함수를 접어요' },
  { keyword: 'gift',    role: 'return',    toneClass: 'text-workbench-green-deep', label: '값을 건네요' },
  { keyword: 'softly',  role: 'connector', toneClass: 'text-workbench-moss',       label: '블록을 부드럽게 열어요' },
];

export interface GlossaryModalProps {
  open: boolean;
  onClose: () => void;
}

export function GlossaryModal({ open, onClose }: GlossaryModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="keyword glossary"
      className="fixed inset-0 z-50 flex items-center justify-center bg-workbench-ink/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-[520px] max-w-[90vw] bg-workbench-panel border border-workbench-rule rounded-lg shadow-workbench"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-workbench-rule-soft">
          <div>
            <div className="font-mono text-[10.5px] tracking-[2px] uppercase text-workbench-green-deep">
              keyword glossary
            </div>
            <div className="font-serif italic text-[18px] text-workbench-ink mt-[2px]">
              일곱 개의 작은 키워드
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="close glossary"
            className="w-[28px] h-[28px] rounded-md text-workbench-ink-mute hover:bg-workbench-soft font-serif text-[16px]"
          >
            ×
          </button>
        </header>

        <ul className="px-6 py-2 m-0 list-none">
          {CHEATS.map((c) => (
            <li
              key={c.keyword}
              className="grid grid-cols-[86px_72px_1fr] gap-3 items-baseline py-[7px] border-b border-workbench-rule-soft last:border-b-0"
            >
              <span className={`font-mono text-[13px] font-medium ${c.toneClass}`}>
                {c.keyword}
              </span>
              <span className="font-mono text-[10px] text-workbench-ink-faint tracking-[0.3px]">
                {c.role}
              </span>
              <span className="font-serif italic text-[12.5px] text-workbench-ink-soft leading-[1.4]">
                {c.label}
              </span>
            </li>
          ))}
        </ul>

        <footer className="px-6 py-[10px] border-t border-workbench-rule-soft bg-workbench-soft font-mono text-[10px] text-workbench-ink-mute tracking-[0.4px]">
          esc · click outside to close
        </footer>
      </div>
    </div>
  );
}
