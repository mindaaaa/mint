import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

const MIN_WIDTH = 850;

export function MobileGuard({ children }: { children: ReactNode }) {
  const [width, setWidth] = useState(
    typeof window === 'undefined' ? MIN_WIDTH : window.innerWidth,
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (width >= MIN_WIDTH) return <>{children}</>;

  return (
    <div className='min-h-screen bg-garden-radial flex items-center justify-center p-6'>
      <div className='max-w-md w-full bg-garden-card rounded-[10px] shadow-garden border border-garden-accent/30 p-8 text-center'>
        <div className='text-5xl mb-4'>🌿</div>
        <div
          className='font-serif italic text-garden-text text-2xl leading-snug mb-3'
          style={{ fontStyle: 'italic' }}
        >
          큰 화면에서
          <br />
          가장 아름답습니다.
        </div>
        <div className='text-garden-sub text-sm leading-relaxed'>
          MINT 정원은{' '}
          <span className='font-mono text-garden-primary'>850px</span> 이상의
          화면에서 피어나도록 다듬어졌어요.
          <br />
          데스크톱 브라우저에서 다시 만나요.
        </div>
        <div className='mt-6 text-xs text-garden-muted tracking-widest'>
          season 0.1 · sunlight drift
        </div>
      </div>
    </div>
  );
}
