import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Topbar, type WorkbenchMode } from './Topbar.js';

function Wrapper(props: Omit<Parameters<typeof Topbar>[0], 'onModeChange' | 'mode'> & { initialMode?: WorkbenchMode }) {
  const { initialMode = 'wander', ...rest } = props;
  const [mode, setMode] = useState<WorkbenchMode>(initialMode);
  return <Topbar {...rest} mode={mode} onModeChange={setMode} />;
}

const meta: Meta<typeof Wrapper> = {
  title: 'workbench/layout/Topbar',
  component: Wrapper,
  parameters: { layout: 'fullscreen' },
  args: {
    onGlossary: () => {},
    onAbout: () => {},
    onRun: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof Wrapper>;

export const Untitled: Story = {
  args: {
    crumb: [],
    currentFile: 'untitled.mint',
    meta: 'empty field',
  },
};

export const ExampleLoaded: Story = {
  args: {
    crumb: ['seedlings', 'growing'],
    currentFile: 'a small poem',
    meta: '14 lines',
  },
};

export const DirtyFile: Story = {
  args: {
    crumb: ['seedlings', 'growing'],
    currentFile: 'a small poem',
    meta: '14 lines · unsaved',
    dirty: true,
  },
};

export const Running: Story = {
  args: {
    crumb: ['seedlings', 'first seeds'],
    currentFile: 'hello, mint',
    meta: '1 line',
    running: true,
  },
};

export const WalkMode: Story = {
  args: {
    crumb: ['walk'],
    currentFile: 'chapter I · the first seed',
    meta: '~1 min',
    initialMode: 'walk',
  },
};

export const CannotRun: Story = {
  args: {
    crumb: [],
    currentFile: 'untitled.mint',
    meta: 'nothing to bloom yet',
    canRun: false,
  },
};
