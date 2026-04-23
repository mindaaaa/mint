import { useMemo } from 'react';
import {
  CATEGORIES,
  EXAMPLES,
  type Example,
  type ExampleCategory,
} from '../../garden/data/examples.js';

export interface SeedDrawerProps {
  examples?: readonly Example[];
  activeId: string | null;
  onSelect: (id: string) => void;
  query: string;
  onQueryChange: (q: string) => void;
  onNewSeed?: () => void;
}

function DrawerHead({ count }: { count: number }) {
  return (
    <div className="flex items-baseline justify-between px-[18px] pt-4 pb-[10px] border-b border-workbench-rule-soft">
      <span className="font-mono text-[10.5px] tracking-[2.4px] uppercase text-workbench-ink-mute">
        seedlings
      </span>
      <span className="font-mono text-[10.5px] text-workbench-ink-faint">
        {count} {count === 1 ? 'file' : 'files'}
      </span>
    </div>
  );
}

function DrawerSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="px-[14px] pt-[10px] pb-2 border-b border-workbench-rule-soft">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="grep the garden…"
        aria-label="search seedlings"
        className="w-full font-mono text-[12px] px-[10px] py-[7px] bg-workbench-soft text-workbench-ink border border-workbench-rule-soft rounded-md outline-none focus:border-workbench-green placeholder:text-workbench-ink-faint"
      />
    </div>
  );
}

function DrawerItem({
  example,
  active,
  onSelect,
}: {
  example: Example;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const isLeaf = example.category === 'fallen-leaves';
  const glyph = active ? '✿' : isLeaf ? '✝' : '·';

  return (
    <button
      type="button"
      onClick={() => onSelect(example.id)}
      aria-current={active ? 'true' : undefined}
      className={`grid grid-cols-[18px_1fr_auto] gap-[10px] items-center w-full px-[10px] py-[8px] mx-[2px] my-px rounded-md text-left transition-colors ${
        active
          ? 'bg-[#E4EDE1]'
          : 'hover:bg-workbench-soft'
      }`}
    >
      <span
        aria-hidden
        className={`font-mono text-[12px] text-center ${
          active
            ? 'text-workbench-green-deep'
            : isLeaf
              ? 'text-workbench-clay'
              : 'text-workbench-moss'
        }`}
      >
        {glyph}
      </span>
      <span
        className={`font-serif italic text-[13px] truncate ${
          isLeaf ? 'text-workbench-clay' : 'text-workbench-ink'
        }`}
      >
        {example.title}
      </span>
      <span className="font-mono text-[10px] text-workbench-ink-faint">
        {example.lineCount}L
      </span>
    </button>
  );
}

function DrawerGroup({
  label,
  items,
  activeId,
  onSelect,
}: {
  label: string;
  items: readonly Example[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section className="pt-[14px] pb-[6px]">
      <div className="font-mono text-[10px] tracking-[1.8px] uppercase text-workbench-ink-mute px-[10px] pb-2">
        {label}
      </div>
      {items.map((ex) => (
        <DrawerItem
          key={ex.id}
          example={ex}
          active={ex.id === activeId}
          onSelect={onSelect}
        />
      ))}
    </section>
  );
}

function DrawerEmpty({ query }: { query: string }) {
  return (
    <div className="px-[18px] py-10 text-center">
      <div className="font-serif italic text-[14px] text-workbench-ink-soft mb-2">
        이 이름의 씨앗은 아직 심긴 적 없어요.
      </div>
      <div className="font-mono text-[11px] text-workbench-ink-faint">
        “{query}”
      </div>
    </div>
  );
}

function DrawerFoot({ onNewSeed }: { onNewSeed?: () => void }) {
  return (
    <div className="mt-2 px-[18px] py-[14px] border-t border-workbench-rule-soft bg-workbench-soft">
      <div className="font-serif italic text-[11.5px] text-workbench-ink-soft leading-[1.7]">
        <div className="text-workbench-ink font-medium not-italic mb-[2px]">
          new seed
        </div>
        빈 정원에서 시작하려면{' '}
        <button
          type="button"
          onClick={onNewSeed}
          className="font-mono not-italic text-workbench-green-deep border-b border-dashed border-workbench-rule hover:border-workbench-green-deep"
        >
          untitled.mint
        </button>
        을 열어보세요.
      </div>
    </div>
  );
}

export function SeedDrawer({
  examples = EXAMPLES,
  activeId,
  onSelect,
  query,
  onQueryChange,
  onNewSeed,
}: SeedDrawerProps) {
  const normalized = query.trim().toLowerCase();

  const groups = useMemo(() => {
    const filtered = normalized
      ? examples.filter(
          (e) =>
            e.title.toLowerCase().includes(normalized) ||
            e.subtitle.toLowerCase().includes(normalized) ||
            e.id.toLowerCase().includes(normalized),
        )
      : examples;
    return CATEGORIES.map((cat) => ({
      id: cat.id as ExampleCategory,
      label: cat.labelShort,
      items: filtered.filter((e) => e.category === cat.id),
    }));
  }, [examples, normalized]);

  const visibleCount = groups.reduce((sum, g) => sum + g.items.length, 0);
  const isEmpty = normalized.length > 0 && visibleCount === 0;

  return (
    <div className="flex flex-col h-full">
      <DrawerHead count={examples.length} />
      <DrawerSearch value={query} onChange={onQueryChange} />

      <div className="flex-1 overflow-y-auto py-1">
        {isEmpty ? (
          <DrawerEmpty query={query} />
        ) : (
          groups.map((g) => (
            <DrawerGroup
              key={g.id}
              label={g.label}
              items={g.items}
              activeId={activeId}
              onSelect={onSelect}
            />
          ))
        )}
      </div>

      <DrawerFoot onNewSeed={onNewSeed} />
    </div>
  );
}
