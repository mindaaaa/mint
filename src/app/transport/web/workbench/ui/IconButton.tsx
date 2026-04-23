import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: string;
  icon: ReactNode;
  tone?: 'default' | 'quiet';
}

const TONE_CLASS: Record<NonNullable<IconButtonProps['tone']>, string> = {
  default:
    'bg-workbench-panel border-workbench-rule text-workbench-ink-soft hover:bg-workbench-soft',
  quiet:
    'bg-transparent border-workbench-rule-soft text-workbench-ink-mute hover:bg-workbench-soft hover:text-workbench-ink-soft',
};

export function IconButton({
  label,
  icon,
  tone = 'default',
  className = '',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center w-[30px] h-[30px] rounded-[7px] border font-serif italic text-[13px] leading-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${TONE_CLASS[tone]} ${className}`}
      {...rest}
    >
      <span aria-hidden>{icon}</span>
    </button>
  );
}
