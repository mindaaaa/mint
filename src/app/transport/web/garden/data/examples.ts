export type ExampleCategory = 'first-seeds' | 'growing' | 'in-full-bloom' | 'fallen-leaves';
export type ExampleDifficulty =
  | 'starter'
  | 'intermediate'
  | 'advanced'
  | 'runtime-error'
  | 'parse-error';

export interface Example {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  category: ExampleCategory;
  difficulty: ExampleDifficulty;
  featured?: boolean;
  lineCount: number;
  preview: string;
  source: string;
}

export const CATEGORIES: Array<{
  id: ExampleCategory;
  label: string;
  emoji: string;
  tagline: string;
  labelShort: string;
}> = [
  {
    id: 'first-seeds',
    label: 'FIRST SEEDS',
    emoji: '🌱',
    tagline: '처음 심는 씨앗',
    labelShort: 'first seeds',
  },
  {
    id: 'growing',
    label: 'GROWING',
    emoji: '🌿',
    tagline: '자라나는 문법',
    labelShort: 'growing',
  },
  {
    id: 'in-full-bloom',
    label: 'IN FULL BLOOM',
    emoji: '🌸',
    tagline: '활짝 피어난 예제',
    labelShort: 'in full bloom',
  },
  {
    id: 'fallen-leaves',
    label: 'FALLEN LEAVES',
    emoji: '🍂',
    tagline: '에러 시연 — 낙엽에서 배우다',
    labelShort: 'fallen leaves',
  },
];

export const EXAMPLES: Example[] = [
  {
    id: 'hello-mint',
    title: 'hello, mint',
    subtitle: '첫 인사 한 줄',
    emoji: '🌼',
    category: 'first-seeds',
    difficulty: 'starter',
    lineCount: 1,
    preview: `sparkle "hello, mint!"`,
    source: `sparkle "hello, mint!"\n`,
  },
  {
    id: 'planting-values',
    title: 'planting values',
    subtitle: '값을 심어보기',
    emoji: '🌱',
    category: 'first-seeds',
    difficulty: 'starter',
    lineCount: 2,
    preview: `plant name = "minda"\nsparkle name`,
    source: `// 이름을 심어봅니다\nplant name = "minda"\nsparkle name\n`,
  },
  {
    id: 'a-gentle-breeze',
    title: 'a gentle breeze',
    subtitle: '첫 조건문',
    emoji: '🌼',
    category: 'first-seeds',
    difficulty: 'starter',
    lineCount: 3,
    preview: `breeze (hope == "sun") softly {\n  sparkle "🌤"\n}`,
    source: `plant hope = "sun"\n\nbreeze (hope == "sun") softly {\n  sparkle "🌤"\n}\n`,
  },
  {
    id: 'seasons-of-breeze',
    title: 'seasons of breeze',
    subtitle: '조건 분기로 계절 표현',
    emoji: '🌾',
    category: 'growing',
    difficulty: 'intermediate',
    lineCount: 8,
    preview: `breeze (season == "spring") softly {\n  sparkle "🌸"\n}`,
    source: `// 계절이 스쳐 지나갑니다\nplant season = "spring"\n\nbreeze (season == "spring") softly {\n  sparkle "🌸"\n}\n\nbreeze (season == "summer") softly {\n  sparkle "🌻"\n}\n`,
  },
  {
    id: 'bloom-three-times',
    title: 'bloom three times',
    subtitle: '꽃이 피어나듯 반복',
    emoji: '🌿',
    category: 'growing',
    difficulty: 'intermediate',
    featured: true,
    lineCount: 6,
    preview: `bloom (count < 3) softly {\n  sparkle "🌼"\n}`,
    source: `plant count = 0\n\nbloom (count < 3) softly {\n  sparkle "🌼"\n  plant count = count + 1\n}\n`,
  },
  {
    id: 'a-little-petal',
    title: 'a little petal',
    subtitle: '함수 선언과 gift',
    emoji: '🌸',
    category: 'growing',
    difficulty: 'intermediate',
    lineCount: 5,
    preview: `petal greet(name) {\n  gift "hi, " + name\n}`,
    source: `petal greet(name) {\n  sparkle "hello, " + name\n  gift "🌼"\n}\n\nsparkle greet("mint whisperer")\n`,
  },
  {
    id: 'a-small-poem',
    title: 'a small poem',
    subtitle: '모든 키워드가 함께 피어남',
    emoji: '✨',
    category: 'in-full-bloom',
    difficulty: 'advanced',
    lineCount: 12,
    preview: `plant hope = "sunlight"\nbreeze (hope == "...") {\n  bloom ...`,
    source: `// 작은 시 한 편\npetal poem() {\n  plant hope = "sunlight"\n  plant count = 0\n\n  breeze (hope == "sunlight") softly {\n    bloom (count < 3) softly {\n      sparkle "🌼"\n      plant count = count + 1\n    }\n  }\n\n  gift "thank you"\n}\n\nsparkle poem()\n`,
  },
  {
    id: 'fibonacci-garden',
    title: 'fibonacci garden',
    subtitle: '재귀로 피어나는 수열',
    emoji: '🌷',
    category: 'in-full-bloom',
    difficulty: 'advanced',
    lineCount: 8,
    preview: `petal fib(n) {\n  breeze (n < 2) ...\n}`,
    source: `// 수열이 피어납니다\npetal fib(n) {\n  breeze (n < 2) softly {\n    gift n\n  }\n\n  gift fib(n - 1) + fib(n - 2)\n}\n\nsparkle fib(5)\n`,
  },
  {
    id: 'sunflower-field',
    title: 'the sunflower field',
    subtitle: '중첩 반복으로 만든 정원',
    emoji: '🌻',
    category: 'in-full-bloom',
    difficulty: 'advanced',
    lineCount: 10,
    preview: `bloom (row < 3) {\n  bloom (col < 5) ...\n}`,
    source: `// 해바라기 밭이 피어납니다\nplant row = 0\n\nbloom (row < 3) softly {\n  plant col = 0\n\n  bloom (col < 5) softly {\n    sparkle "🌻"\n    plant col = col + 1\n  }\n\n  plant row = row + 1\n}\n`,
  },
  {
    id: 'undefined-identifier',
    title: 'undefined identifier',
    subtitle: '심지 않은 변수를 부를 때',
    emoji: '🍃',
    category: 'fallen-leaves',
    difficulty: 'runtime-error',
    lineCount: 2,
    preview: `sparkle undefinedFeeling`,
    source: `sparkle "about to reference an undefined feeling"\nsparkle undefinedFeeling\n`,
  },
  {
    id: 'type-mismatch',
    title: 'type mismatch',
    subtitle: '다른 타입끼리의 연산',
    emoji: '🍂',
    category: 'fallen-leaves',
    difficulty: 'runtime-error',
    lineCount: 4,
    preview: `plant mix = 3 + "🌼"`,
    source: `// 수와 꽃은 같은 말을 나눌 수 없어요\nsparkle "about to mix numbers and flowers"\nplant mix = 3 + "🌼"\nsparkle mix\n`,
  },
  {
    id: 'parser-stumble',
    title: 'parser stumble',
    subtitle: '문법이 꺾인 문장',
    emoji: '🍁',
    category: 'fallen-leaves',
    difficulty: 'parse-error',
    lineCount: 2,
    preview: `bloom (3 < {`,
    source: `// 문장이 중간에 꺾입니다\nbloom (3 < {\n`,
  },
];

export function findExample(id: string): Example | undefined {
  return EXAMPLES.find((e) => e.id === id);
}

export function examplesByCategory(category: ExampleCategory): Example[] {
  return EXAMPLES.filter((e) => e.category === category);
}
