import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { WalkBody } from './WalkBody.js';
import { WALK_CHAPTERS } from '../../garden/data/walkChapters.js';

function Template({ initialId = WALK_CHAPTERS[0]!.id }: { initialId?: string }) {
  const [active, setActive] = useState(initialId);
  return (
    <div className="w-[340px] h-[620px] border border-workbench-rule bg-workbench-panel">
      <WalkBody activeChapterId={active} onChapterChange={setActive} />
    </div>
  );
}

const meta: Meta<typeof Template> = {
  title: 'workbench/panels/WalkBody',
  component: Template,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Template>;

export const ChapterOne: Story = {
  args: { initialId: 'first-seed' },
};

export const ChapterMid: Story = {
  args: { initialId: 'bloom' },
};

export const ChapterLast: Story = {
  args: { initialId: 'gift' },
};
