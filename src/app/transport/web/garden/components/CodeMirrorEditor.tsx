import { useEffect, useRef } from 'react';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { mintExtension } from './MintHighlighter.js';

interface CodeMirrorEditorProps {
  value: string;
  onChange?: (value: string) => void;
  onRun?: () => void;
  readOnly?: boolean;
  className?: string;
}

// workbench 팔레트 (IBM Plex Mono · desaturated earth) — proposal D
const mintTheme = EditorView.theme(
  {
    '&': {
      fontSize: '13px',
      backgroundColor: '#FBFAF3',
      color: '#1C1E1A',
      height: '100%',
    },
    '.cm-content': {
      fontFamily: '"IBM Plex Mono", "JetBrains Mono", ui-monospace, monospace',
      padding: '20px 0',
      caretColor: '#4E7A58',
    },
    '.cm-scroller': {
      fontFamily: '"IBM Plex Mono", "JetBrains Mono", ui-monospace, monospace',
      lineHeight: '1.8',
    },
    '.cm-gutters': {
      backgroundColor: '#FBFAF3',
      borderRight: '1px solid #E6E2D2',
      color: '#A9AC9F',
      paddingRight: '8px',
    },
    '.cm-lineNumbers .cm-gutterElement': {
      fontSize: '11.5px',
      padding: '0 10px 0 14px',
      minWidth: '32px',
      textAlign: 'right',
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(201, 197, 171, 0.22)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'transparent',
      color: '#404540',
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: '#4E7A58',
    },
    '&.cm-focused .cm-selectionBackground, ::selection, .cm-selectionBackground': {
      backgroundColor: 'rgba(78, 122, 88, 0.16)',
    },
    '&.cm-focused': {
      outline: 'none',
    },
  },
  { dark: false },
);

export function CodeMirrorEditor({
  value,
  onChange,
  onRun,
  readOnly = false,
  className = '',
}: CodeMirrorEditorProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);
  const readOnlyCompartment = useRef(new Compartment());

  onChangeRef.current = onChange;
  onRunRef.current = onRun;

  useEffect(() => {
    if (!hostRef.current) return;

    const runKey = {
      key: 'Mod-Enter',
      preventDefault: true,
      run: () => {
        onRunRef.current?.();
        return true;
      },
    };

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        history(),
        keymap.of([runKey, indentWithTab, ...defaultKeymap, ...historyKeymap]),
        mintExtension,
        mintTheme,
        readOnlyCompartment.current.of(EditorState.readOnly.of(readOnly)),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current?.(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({ state, parent: hostRef.current });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // 의도적으로 초기 마운트 시점에만 EditorView를 생성. value/readOnly 변경은 별도 effect로 동기화.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: readOnlyCompartment.current.reconfigure(EditorState.readOnly.of(readOnly)),
    });
  }, [readOnly]);

  return <div ref={hostRef} className={`h-full ${className}`} />;
}
