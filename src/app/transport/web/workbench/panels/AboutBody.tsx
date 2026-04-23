import { WIKI_URLS } from '../../garden/data/docsContent.js';

export function AboutBody() {
  return (
    <div className='px-5 py-5 overflow-y-auto h-full'>
      <div className='font-mono text-[10.5px] tracking-[1.8px] uppercase text-workbench-green-deep'>
        about the garden
      </div>
      <h3 className='font-serif italic font-normal text-[22px] text-workbench-ink leading-[1.15] mt-[6px]'>
        mint — a small language
      </h3>
      <div className='font-mono text-[11px] text-workbench-ink-mute mt-[6px]'>
        a soft-spoken language for expressing life, feeling, and flow
      </div>

      <p className='font-serif text-[13.5px] text-workbench-ink-soft leading-[1.8] mt-5 m-0'>
        MINT는 식물의 생애주기를 따라 지어진 작은 언어입니다. 씨앗을 심고,
        바람이 스쳐 지나가고, 꽃이 피어나는 동안 프로그램이 자라요.
      </p>

      <div className='mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-mono text-[11.5px] leading-[1.5]'>
        <span className='text-workbench-green-deep'>plant</span>
        <span className='text-workbench-ink-soft font-serif italic'>
          이름을 심어요
        </span>
        <span className='text-workbench-amber'>sparkle</span>
        <span className='text-workbench-ink-soft font-serif italic'>
          소리 내어 읽어요
        </span>
        <span className='text-workbench-plum'>breeze</span>
        <span className='text-workbench-ink-soft font-serif italic'>
          조건이 스쳐 지나가요
        </span>
        <span className='text-workbench-clay'>bloom</span>
        <span className='text-workbench-ink-soft font-serif italic'>
          반복해 피워요
        </span>
        <span className='text-workbench-clay'>petal</span>
        <span className='text-workbench-ink-soft font-serif italic'>
          꽃잎처럼 함수를 접어요
        </span>
        <span className='text-workbench-green-deep'>gift</span>
        <span className='text-workbench-ink-soft font-serif italic'>
          값을 건네요
        </span>
      </div>

      <div className='mt-6 pt-4 border-t border-workbench-rule-soft'>
        <div className='font-mono text-[10px] tracking-[1.6px] uppercase text-workbench-ink-mute mb-2'>
          further
        </div>
        <ul className='list-none m-0 p-0 flex flex-col gap-[8px]'>
          <li>
            <a
              href={WIKI_URLS.gettingStarted}
              target='_blank'
              rel='noopener noreferrer'
              className='font-serif italic text-[13px] text-workbench-green-deep border-b border-dashed border-workbench-rule hover:border-workbench-green-deep'
            >
              getting started
            </a>
          </li>
          <li>
            <a
              href={WIKI_URLS.languageGuide}
              target='_blank'
              rel='noopener noreferrer'
              className='font-serif italic text-[13px] text-workbench-green-deep border-b border-dashed border-workbench-rule hover:border-workbench-green-deep'
            >
              language guide · keyword wiki
            </a>
          </li>
          <li>
            <a
              href={WIKI_URLS.errors}
              target='_blank'
              rel='noopener noreferrer'
              className='font-serif italic text-[13px] text-workbench-green-deep border-b border-dashed border-workbench-rule hover:border-workbench-green-deep'
            >
              understanding fallen leaves
            </a>
          </li>
          <li>
            <a
              href={WIKI_URLS.root}
              target='_blank'
              rel='noopener noreferrer'
              className='font-serif italic text-[13px] text-workbench-green-deep border-b border-dashed border-workbench-rule hover:border-workbench-green-deep'
            >
              github / mindaaaa/mint
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
