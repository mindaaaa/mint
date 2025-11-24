export interface TerminalWindow {
  id: number;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

export interface TerminalWindowProps {
  terminal: TerminalWindow;
  isDarkMode: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
}
