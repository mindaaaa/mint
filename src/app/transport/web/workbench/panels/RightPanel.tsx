import type { RunResult } from '@app/run/runner.js';
import { BloomBody } from './BloomBody.js';
import { WalkBody } from './WalkBody.js';
import { AboutBody } from './AboutBody.js';
import { WALK_CHAPTERS } from '../../garden/data/walkChapters.js';

export type RightMode = 'bloom' | 'walk' | 'about';

export interface RightPanelProps {
  mode: RightMode;
  onModeChange: (mode: RightMode) => void;

  // bloom
  result: RunResult | null;
  running: boolean;
  duration?: number | null;

  // walk
  activeChapterId: string;
  onChapterChange: (id: string) => void;
}

const MODE_TABS: ReadonlyArray<{ id: RightMode; label: string; count?: number }> =
  [
    { id: 'bloom', label: 'bloom' },
    { id: 'walk', label: 'walk', count: WALK_CHAPTERS.length },
    { id: 'about', label: 'about' },
  ];

function ModeTabs({
  mode,
  onChange,
}: {
  mode: RightMode;
  onChange: (mode: RightMode) => void;
}) {
  return (
    <div role="tablist" className="flex border-b border-workbench-rule bg-workbench-soft">
      {MODE_TABS.map((tab) => {
        const active = tab.id === mode;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => !active && onChange(tab.id)}
            className={`relative px-4 py-[10px] font-mono text-[11.5px] tracking-[0.5px] border-r border-workbench-rule-soft transition-colors ${
              active
                ? 'bg-workbench-panel text-workbench-ink'
                : 'text-workbench-ink-mute hover:text-workbench-ink-soft'
            }`}
          >
            {tab.label}
            {tab.count != null && (
              <span className="ml-[6px] text-workbench-ink-faint">
                ({tab.count})
              </span>
            )}
            {active && (
              <span
                aria-hidden
                className="absolute left-0 right-0 -bottom-px h-[2px] bg-workbench-green"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export function RightPanel({
  mode,
  onModeChange,
  result,
  running,
  duration,
  activeChapterId,
  onChapterChange,
}: RightPanelProps) {
  return (
    <div className="flex flex-col h-full min-h-0">
      <ModeTabs mode={mode} onChange={onModeChange} />
      <div className="flex-1 min-h-0 overflow-hidden">
        {mode === 'bloom' && (
          <BloomBody result={result} running={running} duration={duration} />
        )}
        {mode === 'walk' && (
          <WalkBody
            activeChapterId={activeChapterId}
            onChapterChange={onChapterChange}
          />
        )}
        {mode === 'about' && <AboutBody />}
      </div>
    </div>
  );
}
