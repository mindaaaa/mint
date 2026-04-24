export interface KeywordDoc {
  name: string;
  role: string;
  oneLiner: string;
  syntax: string;
  example: string;
  commonMistakes: Array<{ title: string; detail: string }>;
}

export const KEYWORD_DOCS: Record<string, KeywordDoc> = {};

const WIKI_ROOT = 'https://github.com/mindaaaa/mint/wiki';

export const WIKI_URLS = {
  root: WIKI_ROOT,
  languageGuide: `${WIKI_ROOT}/%EC%96%B8%EC%96%B4-%EA%B0%80%EC%9D%B4%EB%93%9C`,
  errors: `${WIKI_ROOT}/%EC%97%90%EB%9F%AC-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0`,
  gettingStarted: `${WIKI_ROOT}/Getting-Started`,
  webPlayground: `${WIKI_ROOT}/Web-Playground-Guide`,
} as const;

export interface LanguageGuideEntry {
  slug: string;
  keyword: string;
  label: string;
  colorVar: string;
}

export const LANGUAGE_GUIDE_ENTRIES: LanguageGuideEntry[] = [
  { slug: 'plant', keyword: 'plant', label: '변수', colorVar: '#5B9A6B' },
  { slug: 'sparkle', keyword: 'sparkle', label: '출력', colorVar: '#E5A84E' },
  { slug: 'breeze', keyword: 'breeze', label: '조건', colorVar: '#7B9BCB' },
  { slug: 'bloom', keyword: 'bloom', label: '반복', colorVar: '#D68FA8' },
  { slug: 'petal', keyword: 'petal / gift', label: '함수', colorVar: '#C89CC8' },
  { slug: 'operators', keyword: '연산자 · softly', label: '', colorVar: '#A0B5A8' },
];
