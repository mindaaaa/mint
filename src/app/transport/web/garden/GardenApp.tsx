import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useSearchParams,
} from 'react-router-dom';
import { runSource } from '@app/run/runner.js';
import type { RunResult } from '@app/run/runner.js';

import { MobileGuard } from './layout/MobileGuard.js';
import { CATEGORIES, EXAMPLES, findExample } from './data/examples.js';
import { WALK_CHAPTERS } from './data/walkChapters.js';

import { WorkbenchFrame } from '../workbench/layout/WorkbenchFrame.js';
import { Topbar, type WorkbenchMode } from '../workbench/layout/Topbar.js';
import { SeedDrawer } from '../workbench/panels/SeedDrawer.js';
import { EditorPanel } from '../workbench/panels/EditorPanel.js';
import { RightPanel, type RightMode } from '../workbench/panels/RightPanel.js';
import { GlossaryModal } from '../workbench/panels/GlossaryModal.js';

const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.labelShort]),
);

function Workbench() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialExampleId = searchParams.get('example');
  const initialMode = searchParams.get('mode');

  const [activeExampleId, setActiveExampleId] = useState<string | null>(
    () => (initialExampleId && findExample(initialExampleId) ? initialExampleId : null),
  );
  const [code, setCode] = useState<string>(() => {
    if (initialExampleId) {
      const ex = findExample(initialExampleId);
      if (ex) return ex.source;
    }
    return '';
  });
  const [dirty, setDirty] = useState(false);
  const [drawerQuery, setDrawerQuery] = useState('');

  const [topMode, setTopMode] = useState<WorkbenchMode>(() =>
    initialMode === 'walk' ? 'walk' : 'wander',
  );
  const [rightMode, setRightMode] = useState<RightMode>(() => {
    if (initialMode === 'walk') return 'walk';
    if (initialMode === 'about') return 'about';
    return 'bloom';
  });
  const [walkChapterId, setWalkChapterId] = useState<string>(
    () => WALK_CHAPTERS[0]!.id,
  );

  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  const [glossaryOpen, setGlossaryOpen] = useState(false);

  const activeExample = useMemo(
    () => (activeExampleId ? findExample(activeExampleId) ?? null : null),
    [activeExampleId],
  );

  const activeChapter = useMemo(
    () => WALK_CHAPTERS.find((c) => c.id === walkChapterId) ?? WALK_CHAPTERS[0]!,
    [walkChapterId],
  );

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (activeExampleId) next.set('example', activeExampleId);
    else next.delete('example');

    if (topMode === 'walk') next.set('mode', 'walk');
    else if (rightMode === 'about') next.set('mode', 'about');
    else next.delete('mode');

    const current = searchParams.toString();
    const want = next.toString();
    if (current !== want) {
      setSearchParams(next, { replace: true });
    }
  }, [activeExampleId, topMode, rightMode, searchParams, setSearchParams]);

  const handleSelectExample = useCallback((id: string) => {
    const ex = findExample(id);
    if (!ex) return;
    setActiveExampleId(id);
    setCode(ex.source);
    setDirty(false);
    setResult(null);
    setDuration(null);
    setTopMode('wander');
    setRightMode('bloom');
  }, []);

  const handleNewSeed = useCallback(() => {
    setActiveExampleId(null);
    setCode('');
    setDirty(false);
    setResult(null);
    setDuration(null);
    setTopMode('wander');
    setRightMode('bloom');
  }, []);

  const handleCodeChange = useCallback(
    (v: string) => {
      if (topMode === 'walk') return;
      setCode(v);
      if (activeExample) setDirty(v !== activeExample.source);
      else setDirty(v.length > 0);
    },
    [activeExample, topMode],
  );

  const handleRun = useCallback(() => {
    if (topMode === 'walk') return;
    if (!code.trim()) return;
    setRunning(true);
    const started = performance.now();
    const filename =
      activeExample ? `${activeExample.id}.mint` : 'untitled.mint';
    const res = runSource(code, { filename });
    const elapsed = performance.now() - started;
    setResult(res);
    setDuration(elapsed);
    setRunning(false);
    setRightMode('bloom');
  }, [code, activeExample, topMode]);

  const handleModeChange = useCallback((mode: WorkbenchMode) => {
    setTopMode(mode);
    if (mode === 'walk') setRightMode('walk');
    else setRightMode('bloom');
  }, []);

  const handleRightModeChange = useCallback((mode: RightMode) => {
    setRightMode(mode);
    if (mode === 'walk') setTopMode('walk');
    else if (topMode === 'walk') setTopMode('wander');
  }, [topMode]);

  const handleOpenAbout = useCallback(() => {
    setRightMode('about');
    if (topMode === 'walk') setTopMode('wander');
  }, [topMode]);

  const editorValue = topMode === 'walk' ? activeChapter.code : code;
  const editorReadOnly = topMode === 'walk';

  const editorTabs = useMemo(() => {
    if (topMode === 'walk') {
      return [
        {
          id: `walk-${activeChapter.id}`,
          label: activeChapter.filename,
          closable: false,
        },
      ];
    }
    const label = activeExample ? `${activeExample.id}.mint` : 'untitled.mint';
    return [
      {
        id: activeExampleId ?? 'untitled',
        label,
        dirty,
        closable: false,
      },
    ];
  }, [topMode, activeChapter, activeExample, activeExampleId, dirty]);

  const { crumb, currentFile, meta } = useMemo(() => {
    if (topMode === 'walk') {
      const index = WALK_CHAPTERS.findIndex((c) => c.id === activeChapter.id);
      return {
        crumb: ['walk'] as readonly string[],
        currentFile: `chapter ${index + 1} · ${activeChapter.title}`,
        meta: activeChapter.subtitle,
      };
    }
    if (activeExample) {
      return {
        crumb: ['seedlings', CATEGORY_LABEL[activeExample.category] ?? ''],
        currentFile: activeExample.title,
        meta: `${activeExample.lineCount} ${
          activeExample.lineCount === 1 ? 'line' : 'lines'
        }`,
      };
    }
    return {
      crumb: [] as readonly string[],
      currentFile: 'untitled.mint',
      meta: 'empty field',
    };
  }, [topMode, activeChapter, activeExample]);

  const { statusTone, statusMessage } = useMemo<{
    statusTone: 'ok' | 'running' | 'error' | 'quiet';
    statusMessage: string;
  }>(() => {
    if (topMode === 'walk') return { statusTone: 'quiet', statusMessage: 'walk · read-only' };
    if (running) return { statusTone: 'running', statusMessage: 'blooming…' };
    if (result === null) return { statusTone: 'quiet', statusMessage: 'ready' };
    if (result.ok) return { statusTone: 'ok', statusMessage: 'bloomed · exit 0' };
    return { statusTone: 'error', statusMessage: 'fallen · see right panel' };
  }, [topMode, running, result]);

  const statusKind = topMode === 'walk'
    ? `chapter ${WALK_CHAPTERS.findIndex((c) => c.id === activeChapter.id) + 1} / ${WALK_CHAPTERS.length}`
    : dirty
      ? 'mint v0.3 · unsaved'
      : 'mint v0.3 · growing';

  return (
    <>
      <WorkbenchFrame
        topbar={
          <Topbar
            crumb={crumb}
            currentFile={currentFile}
            meta={meta}
            dirty={dirty && topMode !== 'walk'}
            mode={topMode}
            onModeChange={handleModeChange}
            onGlossary={() => setGlossaryOpen(true)}
            onAbout={handleOpenAbout}
            onRun={handleRun}
            running={running}
            canRun={topMode !== 'walk' && code.trim().length > 0}
          />
        }
        left={
          <SeedDrawer
            examples={EXAMPLES}
            activeId={topMode === 'walk' ? null : activeExampleId}
            onSelect={handleSelectExample}
            query={drawerQuery}
            onQueryChange={setDrawerQuery}
            onNewSeed={handleNewSeed}
          />
        }
        center={
          <EditorPanel
            tabs={editorTabs}
            activeTabId={editorTabs[0]!.id}
            onSelectTab={() => {}}
            value={editorValue}
            onChange={handleCodeChange}
            onRun={handleRun}
            readOnly={editorReadOnly}
            statusTone={statusTone}
            statusMessage={statusMessage}
            statusKind={statusKind}
          />
        }
        right={
          <RightPanel
            mode={rightMode}
            onModeChange={handleRightModeChange}
            result={result}
            running={running}
            duration={duration}
            activeChapterId={walkChapterId}
            onChapterChange={setWalkChapterId}
          />
        }
      />
      <GlossaryModal open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
    </>
  );
}

export function GardenApp() {
  return (
    <MobileGuard>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Workbench />} />
        </Routes>
      </BrowserRouter>
    </MobileGuard>
  );
}
