import type { Meta, StoryObj } from '@storybook/react-vite';
import { RunButton } from './RunButton.js';

const meta: Meta<typeof RunButton> = {
  title: 'workbench/ui/RunButton',
  component: RunButton,
  parameters: { layout: 'centered' },
  args: { children: 'bloom' },
  argTypes: {
    pending: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof RunButton>;

export const Default: Story = {};

export const Pending: Story = {
  args: { pending: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const CustomLabel: Story = {
  args: { children: 'let it bloom' },
};
