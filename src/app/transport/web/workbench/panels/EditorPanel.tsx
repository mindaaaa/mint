import { CodeMirrorEditor } from '../../garden/components/CodeMirrorEditor.js';

export interface EditorTab {
  id: string;
  label: string;
  dirty?: boolean;
  closable?: boolean;
}

export type EditorStatusTone = 'ok' | 'running' | 'error' | 'quiet';

export interface EditorPanelProps {
  tabs: readonly EditorTab[];
  activeTabId: string | null;
  onSelectTab: (id: string) => void;
  onCloseTab?: (id: string) => void;

  value: string;
  onChange?: (value: string) => void;
  onRun?: () => void;
  readOnly?: boolean;

  statusTone?: EditorStatusTone;
  statusMessage?: string;
  statusKind?: string;
  cursor?: { line: number; col: number };
  encoding?: string;
  indent?: string;
}

function EditorTabs({
  tabs,
  activeId,
  onSelect,
  onClose,
}: {
  tabs: readonly EditorTab[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClose?: (id: string) => void;
}) {
  return (
    <div
      role="tablist"
      className="flex bg-workbench-soft border-b border-workbench-rule px-1"
    >
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <div
            key={tab.id}
            role="tab"
            aria-selected={active}
            className={`relative inline-flex items-center gap-[10px] px-4 py-[10px] font-mono text-[11.5px] border-r border-workbench-rule-soft cursor-pointer transition-colors ${
              active
                ? 'bg-workbench-panel text-workbench-ink'
                : 'text-workbench-ink-mute hover:text-workbench-ink-soft'
            }`}
            onClick={() => onSelect(tab.id)}
          >
            <span>{tab.label}</span>
            {tab.dirty && (
              <span aria-label="unsaved" className="text-workbench-amber">
                ●
              </span>
            )}
            {tab.closable !== false && onClose && (
              <button
                type="button"
                aria-label={`close ${tab.label}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(tab.id);
                }}
                className="text-workbench-ink-faint hover:text-workbench-ink-soft leading-none"
              >
                ×
              </button>
            )}
            {active && (
              <span
                aria-hidden
                className="absolute left-0 right-0 -bottom-px h-[2px] bg-workbench-green"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function EditorStatusBar({
  tone = 'ok',
  message,
  kind,
  cursor,
  encoding = 'utf-8',
  indent = 'spaces: 2',
}: {
  tone?: EditorStatusTone;
  message?: string;
  kind?: string;
  cursor?: { line: number; col: number };
  encoding?: string;
  indent?: string;
}) {
  const toneClass: Record<EditorStatusTone, string> = {
    ok: 'text-workbench-green-deep',
    running: 'text-workbench-amber',
    error: 'text-workbench-clay',
    quiet: 'text-workbench-ink-mute',
  };
  return (
    <div className="flex items-center gap-[18px] px-[18px] py-2 border-t border-workbench-rule bg-workbench-soft font-mono text-[11px] text-workbench-ink-mute tracking-[0.3px]">
      {message && (
        <span className={toneClass[tone]}>
          <span aria-hidden>● </span>
          {message}
        </span>
      )}
      {kind && <span>{kind}</span>}
      {cursor && (
        <span>
          ln {cursor.line}, col {cursor.col}
        </span>
      )}
      <span className="flex-1" />
      <span>{encoding}</span>
      <span aria-hidden>·</span>
      <span>{indent}</span>
    </div>
  );
}

export function EditorPanel({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  value,
  onChange,
  onRun,
  readOnly = false,
  statusTone = 'ok',
  statusMessage = 'ready',
  statusKind = 'mint v0.3 · growing',
  cursor,
  encoding,
  indent,
}: EditorPanelProps) {
  return (
    <div className="flex flex-col min-h-0 h-full">
      <EditorTabs
        tabs={tabs}
        activeId={activeTabId}
        onSelect={onSelectTab}
        onClose={onCloseTab}
      />
      <div className="flex-1 min-h-0 bg-workbench-panel">
        <CodeMirrorEditor
          value={value}
          onChange={onChange}
          onRun={onRun}
          readOnly={readOnly}
        />
      </div>
      <EditorStatusBar
        tone={statusTone}
        message={statusMessage}
        kind={statusKind}
        cursor={cursor}
        encoding={encoding}
        indent={indent}
      />
    </div>
  );
}
