import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pill } from './Pill.js';

const meta: Meta<typeof Pill> = {
  title: 'workbench/ui/Pill',
  component: Pill,
  parameters: { layout: 'centered' },
  args: { children: 'starter' },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'growing', 'bloom', 'leaf'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pill>;

export const Neutral: Story = { args: { tone: 'neutral', children: '14 lines' } };

export const Growing: Story = { args: { tone: 'growing', children: 'growing' } };

export const Bloom: Story = { args: { tone: 'bloom', children: 'in full bloom' } };

export const Leaf: Story = { args: { tone: 'leaf', children: 'fallen leaf' } };

export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 p-6 bg-workbench-panel border border-workbench-rule rounded-lg">
      <Pill tone="neutral">14 lines</Pill>
      <Pill tone="growing">growing</Pill>
      <Pill tone="bloom">in full bloom</Pill>
      <Pill tone="leaf">fallen leaf</Pill>
    </div>
  ),
};
