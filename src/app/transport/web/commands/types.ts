type LineType = 'input' | 'output' | 'error' | 'whisper';

export interface TerminalLine {
  type: LineType;
  content: string;
}

export interface CommandResult {
  output?: string;
  clear?: boolean;
  error?: string;
}

export type CommandHandler = (
  args: string[],
  context: CommandContext
) => CommandResult | string | void;

export interface CommandContext {
  setLiens: (updator: (prev: TerminalLine[]) => TerminalLine[]) => void;
  commandHistory: string[];
  lines: TerminalLine[];
}

export type CommandRegistry = Record<string, CommandHandler>;
