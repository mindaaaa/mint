import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { EditorPanel, type EditorTab } from './EditorPanel.js';
import { findExample } from '../../garden/data/examples.js';

const POEM_SRC = findExample('a-small-poem')!.source;
const HELLO_SRC = findExample('hello-mint')!.source;

function Wrapper({
  initialValue,
  initialTabs,
  initialActive,
  readOnly = false,
  statusMessage,
  statusTone,
  statusKind,
  cursor,
}: {
  initialValue: string;
  initialTabs: EditorTab[];
  initialActive: string;
  readOnly?: boolean;
  statusMessage?: string;
  statusTone?: Parameters<typeof EditorPanel>[0]['statusTone'];
  statusKind?: string;
  cursor?: { line: number; col: number };
}) {
  const [value, setValue] = useState(initialValue);
  const [tabs, setTabs] = useState(initialTabs);
  const [active, setActive] = useState(initialActive);
  return (
    <div className="w-[720px] h-[560px] border border-workbench-rule">
      <EditorPanel
        tabs={tabs}
        activeTabId={active}
        onSelectTab={setActive}
        onCloseTab={(id) => setTabs((t) => t.filter((x) => x.id !== id))}
        value={value}
        onChange={setValue}
        onRun={() => {
          /* noop in story */
        }}
        readOnly={readOnly}
        statusMessage={statusMessage}
        statusTone={statusTone}
        statusKind={statusKind}
        cursor={cursor}
      />
    </div>
  );
}

const meta: Meta<typeof Wrapper> = {
  title: 'workbench/panels/EditorPanel',
  component: Wrapper,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Wrapper>;

export const Empty: Story = {
  args: {
    initialValue: '',
    initialTabs: [{ id: 'untitled', label: 'untitled.mint', closable: false }],
    initialActive: 'untitled',
    statusMessage: 'empty field',
    statusTone: 'quiet',
    statusKind: 'mint v0.3 · growing',
  },
};

export const SingleExample: Story = {
  args: {
    initialValue: POEM_SRC,
    initialTabs: [{ id: 'poem', label: 'poem.mint' }],
    initialActive: 'poem',
    statusMessage: 'ready',
    statusTone: 'ok',
    cursor: { line: 8, col: 16 },
  },
};

export const TwoTabsWithDirty: Story = {
  args: {
    initialValue: POEM_SRC,
    initialTabs: [
      { id: 'poem', label: 'poem.mint', dirty: true },
      { id: 'hello', label: 'hello.mint' },
    ],
    initialActive: 'poem',
    statusMessage: 'unsaved changes',
    statusTone: 'running',
    cursor: { line: 4, col: 22 },
  },
};

export const ReadOnlyWalk: Story = {
  args: {
    initialValue: HELLO_SRC,
    initialTabs: [{ id: 'walk-1', label: 'chapter-1.mint', closable: false }],
    initialActive: 'walk-1',
    readOnly: true,
    statusMessage: 'walk · read-only',
    statusTone: 'quiet',
    statusKind: 'chapter I / V',
  },
};

export const AfterError: Story = {
  args: {
    initialValue: 'bloom (3 < {\n',
    initialTabs: [{ id: 'stumble', label: 'stumble.mint', dirty: true }],
    initialActive: 'stumble',
    statusMessage: 'parse stumbled at line 1',
    statusTone: 'error',
    statusKind: 'mint v0.3 · leaf',
    cursor: { line: 1, col: 12 },
  },
};
