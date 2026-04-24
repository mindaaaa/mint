import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ToggleGroup } from './ToggleGroup.js';

type Mode = 'wander' | 'walk';

const WALK_OPTIONS = [
  { value: 'wander' as const, label: 'wander' },
  { value: 'walk' as const, label: 'walk' },
];

function Template({ initial = 'wander' as Mode, disabled = false }) {
  const [value, setValue] = useState<Mode>(initial);
  return (
    <div className="p-6 bg-workbench-panel border border-workbench-rule rounded-lg">
      <ToggleGroup<Mode>
        options={WALK_OPTIONS}
        value={value}
        onChange={setValue}
        disabled={disabled}
        ariaLabel="wander or walk mode"
      />
      <div className="mt-3 font-serif italic text-[12.5px] text-workbench-ink-mute">
        selected: <span className="text-workbench-green-deep">{value}</span>
      </div>
    </div>
  );
}

const meta: Meta<typeof Template> = {
  title: 'workbench/ui/ToggleGroup',
  component: Template,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Template>;

export const WanderDefault: Story = {
  args: { initial: 'wander' },
};

export const WalkActive: Story = {
  args: { initial: 'walk' },
};

export const Disabled: Story = {
  args: { initial: 'wander', disabled: true },
};
