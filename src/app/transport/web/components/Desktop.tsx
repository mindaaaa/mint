import { useState, useRef, useEffect } from 'react';
import { TerminalWindow } from './TerminalWindow.jsx';
import { HiMoon, HiSun } from 'react-icons/hi2';
import { HiTerminal } from 'react-icons/hi';
import type { TerminalWindow as TerminalWindowType } from './types.js';

interface DesktopProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export function Desktop({ isDarkMode, setIsDarkMode }: DesktopProps) {
  const [terminals, setTerminals] = useState<TerminalWindowType[]>([]);
  const [nextId, setNextId] = useState(1);
  const [maxZIndex, setMaxZIndex] = useState(100);
  const clockRef = useRef<HTMLSpanElement>(null);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (clockRef.current) {
        clockRef.current.textContent = new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleIconClick = () => {
    setClickCount((prev) => prev + 1);

    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }

    clickTimeout.current = setTimeout(() => {
      if (clickCount + 1 === 2) {
        // Double click
        openTerminal();
      }
      setClickCount(0);
    }, 300);
  };

  const openTerminal = () => {
    const newTerminal: TerminalWindowType = {
      id: nextId,
      isMinimized: false,
      position: {
        x: 100 + (nextId - 1) * 30,
        y: 80 + (nextId - 1) * 30,
      },
      size: { width: 800, height: 600 },
      zIndex: maxZIndex + 1,
    };

    setTerminals((prev) => [...prev, newTerminal]);
    setNextId((prev) => prev + 1);
    setMaxZIndex((prev) => prev + 1);
  };

  const closeTerminal = (id: number) => {
    setTerminals((prev) => prev.filter((t) => t.id !== id));
  };

  const minimizeTerminal = (id: number) => {
    setTerminals((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isMinimized: true } : t))
    );
  };

  const restoreTerminal = (id: number) => {
    setTerminals((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isMinimized: false, zIndex: maxZIndex + 1 } : t
      )
    );
    setMaxZIndex((prev) => prev + 1);
  };

  const bringToFront = (id: number) => {
    setTerminals((prev) =>
      prev.map((t) => (t.id === id ? { ...t, zIndex: maxZIndex + 1 } : t))
    );
    setMaxZIndex((prev) => prev + 1);
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
        isDarkMode
          ? 'bg-gray-950'
          : 'bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40'
      }`}
      style={{
        backgroundImage: isDarkMode
          ? 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
          : 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.06) 0%, transparent 50%)',
      }}
    >
      {/* Desktop Icons */}
      <div className='absolute top-8 left-8 flex flex-col gap-6'>
        <div
          className='flex flex-col items-center gap-2 cursor-pointer group w-24'
          onClick={handleIconClick}
        >
          <div
            className={`p-4 rounded-2xl transition-all duration-200 shadow-lg ${
              isDarkMode
                ? 'bg-gray-800/50 group-hover:bg-gray-700/50 backdrop-blur-sm'
                : 'bg-white/90 group-hover:bg-white backdrop-blur-sm border border-emerald-200/60 shadow-emerald-100'
            }`}
          >
            <HiTerminal
              size={48}
              className={isDarkMode ? 'text-green-400' : 'text-emerald-600'}
            />
          </div>
          <span
            className={`text-center font-medium ${
              isDarkMode ? 'text-gray-200' : 'text-slate-700'
            }`}
          >
            MINT
          </span>
        </div>
      </div>

      {/* Taskbar */}
      <div
        className={`absolute bottom-0 left-0 right-0 shadow-2xl ${
          isDarkMode
            ? 'bg-gray-900/80 border-t border-gray-800'
            : 'bg-white/95 border-t border-emerald-200/50'
        } backdrop-blur-md`}
      >
        <div className='flex items-center justify-between px-4 py-2'>
          <div className='flex items-center gap-4'>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                isDarkMode
                  ? 'bg-gray-800/50'
                  : 'bg-emerald-50/80 border border-emerald-200/60'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isDarkMode ? 'bg-green-400' : 'bg-emerald-500'
                } animate-pulse`}
              ></div>
              <span
                className={isDarkMode ? 'text-green-400' : 'text-emerald-700'}
              >
                MINT OS
              </span>
            </div>

            {/* Running terminals in taskbar */}
            {terminals.map((terminal) => (
              <button
                key={terminal.id}
                onClick={() => {
                  if (terminal.isMinimized) {
                    restoreTerminal(terminal.id);
                  } else {
                    bringToFront(terminal.id);
                  }
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  terminal.isMinimized
                    ? isDarkMode
                      ? 'bg-gray-800/30 text-gray-500'
                      : 'bg-slate-100/50 text-slate-400'
                    : isDarkMode
                    ? 'bg-gray-800 text-green-400'
                    : 'bg-emerald-50/90 text-emerald-700 border border-emerald-200/60'
                }`}
              >
                <HiTerminal size={16} />
                <span>Terminal {terminal.id}</span>
              </button>
            ))}
          </div>

          <div className='flex items-center gap-4'>
            <span
              ref={clockRef}
              className={isDarkMode ? 'text-gray-400' : 'text-slate-600'}
            >
              {new Date().toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDarkMode
                  ? 'bg-gray-800 text-green-400 hover:bg-gray-700'
                  : 'bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100/90 border border-emerald-200/60'
              }`}
              aria-label='Toggle theme'
            >
              {isDarkMode ? <HiSun size={18} /> : <HiMoon size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Windows */}
      {terminals.map(
        (terminal) =>
          !terminal.isMinimized && (
            <TerminalWindow
              key={terminal.id}
              terminal={terminal}
              isDarkMode={isDarkMode}
              onClose={() => closeTerminal(terminal.id)}
              onMinimize={() => minimizeTerminal(terminal.id)}
              onFocus={() => bringToFront(terminal.id)}
              onMove={(x, y) => {
                setTerminals((prev) =>
                  prev.map((t) =>
                    t.id === terminal.id ? { ...t, position: { x, y } } : t
                  )
                );
              }}
            />
          )
      )}

      {/* Welcome Message - only show when no terminals */}
      {terminals.length === 0 && (
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
          <div className='text-center space-y-4 px-4'>
            <h1
              className={`text-5xl font-semibold ${
                isDarkMode ? 'text-green-400' : 'text-emerald-600'
              }`}
            >
              MINT
            </h1>
            <p
              className={`text-xl italic ${
                isDarkMode ? 'text-gray-300' : 'text-slate-700'
              }`}
            >
              A soft-spoken language for expressing life, feeling, and flow.
            </p>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
              You don't write code in MINT. You whisper it.
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? 'text-gray-500' : 'text-slate-500'
              } mt-8`}
            >
              더블클릭하여 터미널 시작하기
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
