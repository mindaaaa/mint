import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './IconButton.js';

const meta: Meta<typeof IconButton> = {
  title: 'workbench/ui/IconButton',
  component: IconButton,
  parameters: { layout: 'centered' },
  args: {
    label: 'open glossary',
    icon: '✿',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['default', 'quiet'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {};

export const Quiet: Story = {
  args: { tone: 'quiet', label: 'about', icon: 'i' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const InRow: Story = {
  render: (args) => (
    <div className="flex gap-2 p-6 bg-workbench-panel border border-workbench-rule rounded-lg">
      <IconButton {...args} label="open glossary" icon="✿" />
      <IconButton {...args} label="about mint" icon="i" tone="quiet" />
      <IconButton {...args} label="settings" icon="·" tone="quiet" disabled />
    </div>
  ),
};
