import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface RunButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children?: ReactNode;
  pending?: boolean;
}

export function RunButton({
  children = 'bloom',
  pending = false,
  disabled,
  className = '',
  ...rest
}: RunButtonProps) {
  const isDisabled = disabled || pending;
  return (
    <button
      type="button"
      disabled={isDisabled}
      className={`inline-flex items-center gap-1.5 font-mono text-[12px] tracking-[0.6px] px-4 py-[7px] rounded-[7px] text-white bg-workbench-green hover:bg-workbench-green-deep disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
      {...rest}
    >
      <span aria-hidden>{pending ? '◌' : '▸'}</span>
      <span>{pending ? 'blooming…' : children}</span>
    </button>
  );
}
