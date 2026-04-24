import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { GlossaryModal } from './GlossaryModal.js';

function Template() {
  const [open, setOpen] = useState(true);
  return (
    <div className="relative w-[720px] h-[560px] bg-workbench-bg border border-workbench-rule flex items-center justify-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-mono text-[12px] px-4 py-[7px] border border-workbench-rule rounded-md bg-workbench-panel text-workbench-ink-soft hover:bg-workbench-soft"
      >
        open glossary
      </button>
      <GlossaryModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

const meta: Meta<typeof Template> = {
  title: 'workbench/panels/GlossaryModal',
  component: Template,
  parameters: { layout: 'centered' },
};

export default meta;

export const Opened: StoryObj<typeof Template> = {};
