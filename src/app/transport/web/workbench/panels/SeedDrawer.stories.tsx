import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SeedDrawer } from './SeedDrawer.js';
import { EXAMPLES } from '../../garden/data/examples.js';

function Template({
  initialActive = null,
  initialQuery = '',
}: {
  initialActive?: string | null;
  initialQuery?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(initialActive);
  const [query, setQuery] = useState(initialQuery);
  return (
    <div className="w-[260px] h-[640px] border border-workbench-rule bg-workbench-panel">
      <SeedDrawer
        activeId={activeId}
        onSelect={setActiveId}
        query={query}
        onQueryChange={setQuery}
        onNewSeed={() => setActiveId(null)}
      />
    </div>
  );
}

const meta: Meta<typeof Template> = {
  title: 'workbench/panels/SeedDrawer',
  component: Template,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Template>;

export const Default: Story = {
  args: { initialActive: null, initialQuery: '' },
};

export const ActiveItem: Story = {
  args: { initialActive: 'a-small-poem', initialQuery: '' },
};

export const FilteredPoem: Story = {
  args: { initialActive: 'a-small-poem', initialQuery: 'poem' },
};

export const FilteredBloom: Story = {
  args: { initialActive: null, initialQuery: 'bloom' },
};

export const EmptyResults: Story = {
  args: { initialActive: null, initialQuery: 'zzz-nothing' },
};

export const LeafActive: Story = {
  args: { initialActive: 'parser-stumble', initialQuery: '' },
};

export const LongListScroll: Story = {
  render: () => {
    const manyExamples = [
      ...EXAMPLES,
      ...EXAMPLES.map((e, i) => ({ ...e, id: `${e.id}-dup-${i}`, title: `${e.title} (echo)` })),
    ];
    const [activeId, setActiveId] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    return (
      <div className="w-[260px] h-[640px] border border-workbench-rule bg-workbench-panel">
        <SeedDrawer
          examples={manyExamples}
          activeId={activeId}
          onSelect={setActiveId}
          query={query}
          onQueryChange={setQuery}
          onNewSeed={() => setActiveId(null)}
        />
      </div>
    );
  },
};
