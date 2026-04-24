import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { WorkbenchFrame } from './WorkbenchFrame.js';
import { Topbar, type WorkbenchMode } from './Topbar.js';

function SlotStub({ title, accent }: { title: string; accent: string }) {
  return (
    <div
      className="w-full h-full p-4 flex flex-col gap-2 border-dashed"
      style={{ background: accent }}
    >
      <div className="font-mono text-[10.5px] tracking-[2px] uppercase text-workbench-ink-mute">
        slot · {title}
      </div>
      <div className="font-serif italic text-[15px] text-workbench-ink-soft">
        {title === 'left' && '11 seedlings live here'}
        {title === 'center' && 'code flows through the middle'}
        {title === 'right' && 'bloom / walk / about · right side'}
      </div>
    </div>
  );
}

function Template() {
  const [mode, setMode] = useState<WorkbenchMode>('wander');
  return (
    <WorkbenchFrame
      topbar={
        <Topbar
          crumb={['seedlings', 'growing']}
          currentFile="a small poem"
          meta="14 lines"
          mode={mode}
          onModeChange={setMode}
          onGlossary={() => {}}
          onAbout={() => {}}
          onRun={() => {}}
        />
      }
      left={<SlotStub title="left" accent="#F2F0E5" />}
      center={<SlotStub title="center" accent="#FBFAF3" />}
      right={<SlotStub title="right" accent="#F2EFE1" />}
    />
  );
}

const meta: Meta<typeof Template> = {
  title: 'workbench/layout/WorkbenchFrame',
  component: Template,
  parameters: { layout: 'fullscreen' },
};

export default meta;

export const ThreeColumns: StoryObj<typeof Template> = {};
