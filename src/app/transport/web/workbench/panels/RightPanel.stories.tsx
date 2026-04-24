import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { RightPanel, type RightMode } from './RightPanel.js';
import { MintError } from '@app/run/errors.js';
import type { RunResult } from '@app/run/runner.js';
import { WALK_CHAPTERS } from '../../garden/data/walkChapters.js';

function Template({
  initialMode = 'bloom' as RightMode,
  result = null as RunResult | null,
  running = false,
  duration = null as number | null,
}) {
  const [mode, setMode] = useState<RightMode>(initialMode);
  const [chapterId, setChapterId] = useState(WALK_CHAPTERS[0]!.id);
  return (
    <div className="w-[340px] h-[620px] border border-workbench-rule bg-workbench-panel">
      <RightPanel
        mode={mode}
        onModeChange={setMode}
        result={result}
        running={running}
        duration={duration}
        activeChapterId={chapterId}
        onChapterChange={setChapterId}
      />
    </div>
  );
}

const meta: Meta<typeof Template> = {
  title: 'workbench/panels/RightPanel',
  component: Template,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Template>;

export const BloomEmpty: Story = { args: { initialMode: 'bloom' } };

export const BloomSuccess: Story = {
  args: {
    initialMode: 'bloom',
    result: { ok: true, stdout: ['🌼', '🌼', '🌼', 'thank you'] },
    duration: 67,
  },
};

export const BloomError: Story = {
  args: {
    initialMode: 'bloom',
    result: {
      ok: false,
      error: new MintError({
        origin: 'PARSER',
        message: '문법이 중간에 꺾였어요. `bloom (3 < {`에서 조건이 닫히지 않았어요.',
        hint: 'bloom 조건은 괄호로 감싸고 softly { … }로 이어가보세요.',
      }),
    },
  },
};

export const BloomRunning: Story = {
  args: { initialMode: 'bloom', running: true },
};

export const WalkMode: Story = { args: { initialMode: 'walk' } };

export const AboutMode: Story = { args: { initialMode: 'about' } };
