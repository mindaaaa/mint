import { useState, useRef, useEffect } from 'react';
import { executeCommand } from '@web/commands/executor.js';
import { commands } from '@web/commands/index.js';
import type { CommandContext, TerminalLine } from '@web/commands/types.js';
import { FileSystemStore } from '@web/commands/store/FileSystem.js';

interface TerminalProps {
  isDarkMode: boolean;
}

export function Terminal({ isDarkMode }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'whisper', content: '🌱 MINT v0.1.0 - A soft-spoken language' },
    {
      type: 'output',
      content: '"You don\'t write code in MINT. You whisper it."',
    },
    { type: 'output', content: '' },
    { type: 'output', content: '도움말을 보려면 "help"를 입력하세요.' },
    { type: 'output', content: '' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    FileSystemStore.init();
  }, []);

  const executeCommandHandler = (input: string) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const context: CommandContext = {
      setLines,
      commandHistory,
      lines,
    };

    const executed = executeCommand(trimmedInput, commands, context);

    if (executed) {
      setCommandHistory((prev) => [...prev, trimmedInput]);
    }

    setCurrentInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEnter();
    } else if (e.key === 'ArrowUp') {
      handleArrowUp(e);
    } else if (e.key === 'ArrowDown') {
      handleArrowDown(e);
    } else if (e.key === 'l' && e.ctrlKey) {
      handleClear(e);
    }
  };

  const handleEnter = () => {
    executeCommandHandler(currentInput);
  };

  const handleArrowUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (commandHistory.length === 0) return;

    const newIndex =
      historyIndex === -1
        ? commandHistory.length - 1
        : Math.max(0, historyIndex - 1);
    setHistoryIndex(newIndex);
    setCurrentInput(commandHistory[newIndex]);
  };

  const handleArrowDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (historyIndex === -1) return;

    const newIndex = historyIndex + 1;
    if (newIndex >= commandHistory.length) {
      setHistoryIndex(-1);
      setCurrentInput('');
    } else {
      setHistoryIndex(newIndex);
      setCurrentInput(commandHistory[newIndex]);
    }
  };

  const handleClear = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    executeCommandHandler('clear');
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      onClick={handleTerminalClick}
      className={`p-4 overflow-y-auto cursor-text font-mono ${
        isDarkMode
          ? 'text-green-400 bg-gray-900'
          : 'text-emerald-700 bg-slate-50'
      }`}
      style={{
        fontFamily: '"Courier New", Courier, monospace',
        height: '500px',
      }}
      ref={terminalRef}
    >
      {lines.map((line, index) => (
        <div
          key={index}
          className={`mb-1 ${
            line.type === 'error'
              ? isDarkMode
                ? 'text-red-400'
                : 'text-red-600'
              : line.type === 'whisper'
              ? isDarkMode
                ? 'text-green-300'
                : 'text-emerald-600'
              : line.type === 'input'
              ? isDarkMode
                ? 'text-green-400'
                : 'text-emerald-700'
              : isDarkMode
              ? 'text-gray-300'
              : 'text-slate-700'
          }`}
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {line.content}
        </div>
      ))}

      {/* Input Line */}
      <div className='flex items-center'>
        <span
          className={`mr-2 ${
            isDarkMode ? 'text-green-400' : 'text-emerald-700'
          }`}
        >
          🌱
        </span>
        <input
          ref={inputRef}
          type='text'
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`flex-1 bg-transparent outline-none ${
            isDarkMode
              ? 'text-green-400 caret-green-400'
              : 'text-emerald-700 caret-emerald-600'
          }`}
          autoFocus
          spellCheck={false}
        />
      </div>
    </div>
  );
}
