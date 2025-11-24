import { useState, useEffect } from 'react';
import { Terminal } from './Terminal.jsx';
import type { TerminalWindowProps } from './types.js';

export function TerminalWindow({
  terminal,
  isDarkMode,
  onClose,
  onMinimize,
  onFocus,
  onMove,
}: TerminalWindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.terminal-header')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - terminal.position.x,
        y: e.clientY - terminal.position.y,
      });
      onFocus();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      onMove(e.clientX - dragOffset.x, e.clientY - dragOffset.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div
      className='absolute'
      style={{
        left: terminal.position.x,
        top: terminal.position.y,
        zIndex: terminal.zIndex,
      }}
      onMouseDown={handleMouseDown}
      onClick={onFocus}
    >
      <div
        className={`rounded-lg shadow-2xl overflow-hidden ${
          isDarkMode
            ? 'bg-gray-900 border border-gray-800'
            : 'bg-white border border-emerald-200/60 shadow-emerald-100/50'
        }`}
        style={{ width: terminal.size.width, maxWidth: '90vw' }}
      >
        {/* Terminal Header */}
        <div
          className={`terminal-header flex items-center justify-between px-4 py-3 cursor-move ${
            isDarkMode
              ? 'bg-gray-800 border-b border-gray-700'
              : 'bg-gradient-to-r from-emerald-50/80 to-teal-50/60 border-b border-emerald-200/60'
          }`}
        >
          <div className='flex items-center gap-3'>
            <div className='flex gap-2'>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className='w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors'
              ></button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMinimize();
                }}
                className='w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors'
              ></button>
              <div className='w-3 h-3 rounded-full bg-green-500'></div>
            </div>
            <span
              className={`ml-2 font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-slate-700'
              }`}
            >
              MINT Terminal
            </span>
          </div>
        </div>

        {/* Terminal Content */}
        <Terminal isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}
