export interface ToggleOption<T extends string> {
  value: T;
  label: string;
}

export interface ToggleGroupProps<T extends string> {
  options: ReadonlyArray<ToggleOption<T>>;
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

export function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  disabled = false,
  ariaLabel,
  className = '',
}: ToggleGroupProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={`inline-flex rounded-[7px] border border-workbench-rule bg-workbench-panel overflow-hidden ${className}`}
    >
      {options.map((opt, i) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => !active && onChange(opt.value)}
            className={`font-mono text-[11.5px] px-3 py-[6px] tracking-[0.4px] leading-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              active
                ? 'bg-workbench-ink text-workbench-panel'
                : 'bg-transparent text-workbench-ink-soft hover:bg-workbench-soft'
            } ${i < options.length - 1 ? 'border-r border-workbench-rule-soft' : ''}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
