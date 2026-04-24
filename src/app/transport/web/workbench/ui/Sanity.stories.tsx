import type { Meta, StoryObj } from '@storybook/react-vite';

function Sanity() {
  return (
    <div className="p-10 font-serif">
      <div className="text-xs tracking-[3px] uppercase text-workbench-green-deep italic">
        · · ·   sanity check   · · ·
      </div>
      <div className="italic text-3xl text-workbench-ink mt-3">
        the garden is listening.
      </div>
      <div className="text-sm text-workbench-ink-mute italic mt-2 max-w-md">
        Storybook이 workbench 팔레트·IBM Plex 폰트를 올바르게 읽고 있어요.
      </div>
      <pre className="mt-5 font-mono text-[13px] text-workbench-ink bg-workbench-panel border border-workbench-rule-soft px-4 py-3 rounded">
        sparkle "hello, mint!"
      </pre>
    </div>
  );
}

const meta: Meta<typeof Sanity> = {
  title: 'workbench/sanity',
  component: Sanity,
  parameters: { layout: 'fullscreen' },
};

export default meta;

export const Default: StoryObj<typeof Sanity> = {};
