import type { Meta, StoryObj } from '@storybook/react-vite';
import { AboutBody } from './AboutBody.js';

const meta: Meta<typeof AboutBody> = {
  title: 'workbench/panels/AboutBody',
  component: AboutBody,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-[340px] h-[620px] border border-workbench-rule bg-workbench-panel">
        {Story()}
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AboutBody>;

export const Default: Story = {};
