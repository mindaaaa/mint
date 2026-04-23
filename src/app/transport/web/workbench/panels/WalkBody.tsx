import { useMemo } from 'react';
import {
  WALK_CHAPTERS,
  type WalkChapter,
} from '../../garden/data/walkChapters.js';

export interface WalkBodyProps {
  chapters?: readonly WalkChapter[];
  activeChapterId: string;
  onChapterChange: (id: string) => void;
}

export function WalkBody({
  chapters = WALK_CHAPTERS,
  activeChapterId,
  onChapterChange,
}: WalkBodyProps) {
  const { index, chapter, prev, next } = useMemo(() => {
    const i = chapters.findIndex((c) => c.id === activeChapterId);
    const safe = i < 0 ? 0 : i;
    return {
      index: safe,
      chapter: chapters[safe]!,
      prev: chapters[safe - 1] ?? null,
      next: chapters[safe + 1] ?? null,
    };
  }, [chapters, activeChapterId]);

  const total = chapters.length;

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-4">
        <div className="font-mono text-[10.5px] tracking-[1.8px] uppercase text-workbench-green-deep">
          chapter {index + 1} / {total}
        </div>
        <h3 className="font-serif italic font-normal text-[22px] text-workbench-ink leading-[1.15] mt-[6px]">
          {chapter.title}
        </h3>
        <div className="font-mono text-[11px] text-workbench-ink-mute mt-[6px]">
          {chapter.subtitle}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5">
        <p className="font-serif text-[14px] text-workbench-ink-soft leading-[1.8] whitespace-pre-line m-0">
          {chapter.narration}
        </p>

        <div className="mt-4 font-mono text-[11.5px] text-workbench-ink bg-workbench-soft border-l-2 border-workbench-rule px-3 py-[10px] leading-[1.6]">
          <span className="text-workbench-ink-mute">syntax · </span>
          {chapter.syntax}
        </div>

        <p className="font-serif text-[13.5px] text-workbench-ink-soft leading-[1.8] whitespace-pre-line mt-4 m-0">
          {chapter.description}
        </p>

        {chapter.tip && (
          <div className="mt-4 font-serif italic text-[12.5px] text-workbench-ink-mute leading-[1.7]">
            <span className="font-mono not-italic text-[10px] tracking-[1.6px] uppercase text-workbench-moss mr-[6px]">
              tip
            </span>
            {chapter.tip}
          </div>
        )}

        {chapter.tryIt && (
          <div className="mt-3 font-serif italic text-[12.5px] text-workbench-amber leading-[1.7]">
            <span className="font-mono not-italic text-[10px] tracking-[1.6px] uppercase mr-[6px]">
              try
            </span>
            {chapter.tryIt}
          </div>
        )}

        <div className="h-6" />
      </div>

      <div className="flex items-center justify-between gap-2 px-5 py-[14px] border-t border-workbench-rule-soft bg-workbench-soft">
        <button
          type="button"
          onClick={() => prev && onChapterChange(prev.id)}
          disabled={!prev}
          className="font-mono text-[11.5px] px-[10px] py-[6px] border border-workbench-rule rounded-md text-workbench-ink-soft disabled:opacity-30 disabled:cursor-not-allowed hover:bg-workbench-panel"
        >
          ← {prev ? prev.title : 'start'}
        </button>
        <button
          type="button"
          onClick={() => next && onChapterChange(next.id)}
          disabled={!next}
          className="font-mono text-[11.5px] px-[10px] py-[6px] border rounded-md disabled:opacity-30 disabled:cursor-not-allowed border-workbench-green bg-workbench-green text-white hover:bg-workbench-green-deep"
        >
          {next ? next.title : 'end'} →
        </button>
      </div>
    </div>
  );
}
