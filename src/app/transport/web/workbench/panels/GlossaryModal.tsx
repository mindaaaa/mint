import { useEffect } from 'react';

interface KeywordCheat {
  keyword: string;
  label: string;
  role: string;
  toneClass: string;
  example: string;
}

const CHEATS: readonly KeywordCheat[] = [
  {
    keyword: 'plant',
    label: '이름을 심어요',
    role: 'variable',
    toneClass: 'text-workbench-green-deep',
    example: `plant hope = "sunlight"`,
  },
  {
    keyword: 'sparkle',
    label: '소리 내어 읽어요',
    role: 'print',
    toneClass: 'text-workbench-amber',
    example: `sparkle "hello, mint!"`,
  },
  {
    keyword: 'breeze',
    label: '조건이 스쳐 지나가요',
    role: 'if',
    toneClass: 'text-workbench-plum',
    example: `breeze (x == 1) softly { … }`,
  },
  {
    keyword: 'bloom',
    label: '반복해 피워요',
    role: 'while',
    toneClass: 'text-workbench-clay',
    example: `bloom (count < 3) softly { … }`,
  },
  {
    keyword: 'petal',
    label: '꽃잎처럼 함수를 접어요',
    role: 'function',
    toneClass: 'text-workbench-clay',
    example: `petal greet(name) { … }`,
  },
  {
    keyword: 'gift',
    label: '값을 건네요',
    role: 'return',
    toneClass: 'text-workbench-green-deep',
    example: `gift "thank you"`,
  },
  {
    keyword: 'softly',
    label: '블록을 부드럽게 열어요',
    role: 'connector',
    toneClass: 'text-workbench-moss',
    example: `breeze (…) softly { … }`,
  },
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
        className="w-[560px] max-w-[90vw] max-h-[80vh] overflow-y-auto bg-workbench-panel border border-workbench-rule rounded-lg shadow-workbench"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-6 pt-6 pb-3 border-b border-workbench-rule-soft">
          <div>
            <div className="font-mono text-[10.5px] tracking-[2px] uppercase text-workbench-green-deep">
              keyword glossary
            </div>
            <div className="font-serif italic text-[22px] text-workbench-ink mt-[4px]">
              일곱 개의 작은 키워드
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="close glossary"
            className="w-[30px] h-[30px] rounded-md text-workbench-ink-mute hover:bg-workbench-soft font-serif text-[16px]"
          >
            ×
          </button>
        </header>

        <div className="px-6 py-5 flex flex-col gap-3">
          {CHEATS.map((c) => (
            <article
              key={c.keyword}
              className="grid grid-cols-[110px_1fr] gap-4 items-baseline py-[10px] border-b border-workbench-rule-soft last:border-b-0"
            >
              <div>
                <div className={`font-mono text-[14px] font-medium ${c.toneClass}`}>
                  {c.keyword}
                </div>
                <div className="font-mono text-[10px] text-workbench-ink-faint mt-[2px]">
                  {c.role}
                </div>
              </div>
              <div>
                <div className="font-serif italic text-[13.5px] text-workbench-ink leading-[1.55]">
                  {c.label}
                </div>
                <pre className="font-mono text-[11.5px] text-workbench-ink-soft mt-[6px] bg-workbench-soft border-l-2 border-workbench-rule px-[10px] py-[6px] rounded-r m-0 whitespace-pre-wrap">
                  {c.example}
                </pre>
              </div>
            </article>
          ))}
        </div>

        <footer className="px-6 py-3 border-t border-workbench-rule-soft bg-workbench-soft font-mono text-[10.5px] text-workbench-ink-mute tracking-[0.4px]">
          esc를 누르거나 바깥을 눌러 닫기 · 자세한 내용은 about → language guide
        </footer>
      </div>
    </div>
  );
}
