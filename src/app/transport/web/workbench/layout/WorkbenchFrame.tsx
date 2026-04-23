import type { ReactNode } from 'react';

export interface WorkbenchFrameProps {
  topbar: ReactNode;
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
}

export function WorkbenchFrame({ topbar, left, center, right }: WorkbenchFrameProps) {
  return (
    <div className="min-h-screen flex flex-col bg-workbench-bg text-workbench-ink font-serif">
      {topbar}
      <main className="flex-1 grid grid-cols-[260px_minmax(0,1fr)_340px] min-h-0">
        <aside className="bg-workbench-panel border-r border-workbench-rule overflow-y-auto min-w-0">
          {left}
        </aside>
        <section className="bg-workbench-panel border-r border-workbench-rule flex flex-col min-h-0 min-w-0 overflow-hidden">
          {center}
        </section>
        <aside className="bg-workbench-panel overflow-y-auto min-w-0">
          {right}
        </aside>
      </main>
    </div>
  );
}
