import type { Meta, StoryObj } from '@storybook/react-vite';
import { MintError } from '@app/run/errors.js';
import { BloomBody } from './BloomBody.js';

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[340px] h-[560px] border border-workbench-rule bg-workbench-panel">
      {children}
    </div>
  );
}

const meta: Meta<typeof BloomBody> = {
  title: 'workbench/panels/BloomBody',
  component: BloomBody,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <Frame>{Story()}</Frame>],
};

export default meta;
type Story = StoryObj<typeof BloomBody>;

export const EmptyField: Story = {
  args: { result: null, running: false, duration: null },
};

export const Running: Story = {
  args: { result: null, running: true, duration: null },
};

export const SuccessMultiline: Story = {
  args: {
    result: { ok: true, stdout: ['hello, mint!', 'nice to meet you'] },
    running: false,
    duration: 42,
  },
};

export const SuccessGlyphs: Story = {
  args: {
    result: { ok: true, stdout: ['🌼', '🌼', '🌼', 'thank you'] },
    running: false,
    duration: 67,
  },
};

export const SuccessSilent: Story = {
  args: {
    result: { ok: true, stdout: [] },
    running: false,
    duration: 12,
  },
};

const parseError = new MintError({
  origin: 'PARSER',
  message: '문법이 중간에 꺾였어요. `bloom (3 < {`에서 조건이 닫히지 않았어요.',
  hint: 'bloom 조건은 괄호로 감싸고 softly { … }로 이어가보세요.',
});

export const ErrorParse: Story = {
  args: { result: { ok: false, error: parseError }, running: false, duration: null },
};

const evalError = new MintError({
  origin: 'EVALUATOR',
  message: '심지 않은 변수 `rainfall`을 부르고 있어요.',
  hint: 'sparkle 앞에 plant rainfall = … 로 값을 먼저 심어주세요.',
});

export const ErrorEvaluator: Story = {
  args: { result: { ok: false, error: evalError }, running: false, duration: null },
};
