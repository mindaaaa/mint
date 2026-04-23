import { IconButton } from '../ui/IconButton.js';
import { RunButton } from '../ui/RunButton.js';
import { ToggleGroup } from '../ui/ToggleGroup.js';

export type WorkbenchMode = 'wander' | 'walk';

const MODE_OPTIONS = [
  { value: 'wander' as const, label: 'wander' },
  { value: 'walk' as const, label: 'walk' },
];

export interface TopbarProps {
  crumb: ReadonlyArray<string>;
  currentFile: string;
  meta?: string;
  dirty?: boolean;
  mode: WorkbenchMode;
  onModeChange: (mode: WorkbenchMode) => void;
  onGlossary?: () => void;
  onAbout?: () => void;
  onRun: () => void;
  running?: boolean;
  canRun?: boolean;
}

export function Topbar({
  crumb,
  currentFile,
  meta,
  dirty = false,
  mode,
  onModeChange,
  onGlossary,
  onAbout,
  onRun,
  running = false,
  canRun = true,
}: TopbarProps) {
  return (
    <header className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-[10px] bg-workbench-panel border-b border-workbench-rule">
      <div className="font-serif italic text-[18px] tracking-[-0.2px] text-workbench-ink">
        <span aria-hidden className="text-workbench-green font-bold mr-[6px]">·</span>
        mint <span className="font-medium not-italic">garden</span>
      </div>

      <nav
        aria-label="breadcrumb"
        className="font-mono text-[11.5px] tracking-[0.2px] text-workbench-ink-mute flex items-center overflow-hidden"
      >
        {crumb.map((part) => (
          <span key={part} className="flex items-center whitespace-nowrap">
            <span>{part}</span>
            <span className="text-workbench-ink-faint mx-[6px]">/</span>
          </span>
        ))}
        <span className="text-workbench-ink font-medium whitespace-nowrap truncate">
          {currentFile}
        </span>
        {dirty && (
          <span
            aria-label="unsaved"
            className="text-workbench-amber ml-[6px]"
          >
            ●
          </span>
        )}
        {meta && (
          <span className="text-workbench-ink-faint ml-[14px] whitespace-nowrap">
            · {meta}
          </span>
        )}
      </nav>

      <div className="flex items-center gap-1.5">
        <ToggleGroup<WorkbenchMode>
          options={MODE_OPTIONS}
          value={mode}
          onChange={onModeChange}
          ariaLabel="workbench mode"
        />
        <IconButton
          label="keyword glossary"
          icon="✿"
          onClick={onGlossary}
          disabled={!onGlossary}
        />
        <IconButton
          label="about mint"
          icon="i"
          tone="quiet"
          onClick={onAbout}
          disabled={!onAbout}
        />
        <RunButton
          onClick={onRun}
          pending={running}
          disabled={!canRun}
          className="ml-1"
        />
      </div>
    </header>
  );
}
