export interface WalkChapter {
  id: string;
  title: string;
  subtitle: string;
  chapterEmoji: string;
  iconGradient: string;
  keywordName: string;
  keywordColor: string;
  code: string;
  filename: string;
  narration: string;
  syntax: string;
  description: string;
  tip?: string;
  tryIt?: string;
}

export const WALK_CHAPTERS: WalkChapter[] = [
  {
    id: 'first-seed',
    title: '첫 씨앗',
    subtitle: 'plant · sparkle',
    chapterEmoji: '🌱',
    iconGradient: 'linear-gradient(135deg, #C8EDD2 0%, #5B9A6B 100%)',
    keywordName: 'plant',
    keywordColor: '#5B9A6B',
    code: `// 첫 씨앗을 심어봅니다
plant hope = "sunlight"
sparkle hope
`,
    filename: '🌱 first-seed.mint',
    narration:
      '이름에 값을 심고,\nsparkle로 피어나게 해요.',
    syntax: 'plant 이름 = 값',
    description:
      'plant는 정원에 값을 심는 행위예요. 이름은 팻말, 값은 씨앗.\nsparkle은 심은 것을 빛나게 꺼내 보여줍니다.',
    tip: '같은 이름에 다시 plant하면 값이 새로 심겨요.',
  },
  {
    id: 'gentle-breeze',
    title: '바람이 스치면',
    subtitle: 'breeze · softly',
    chapterEmoji: '🍃',
    iconGradient: 'linear-gradient(135deg, #CCDAF2 0%, #7B9BCB 100%)',
    keywordName: 'breeze',
    keywordColor: '#7B9BCB',
    code: `plant mood = "sunny"

breeze (mood == "sunny") softly {
  sparkle "🌤"
}
`,
    filename: '🍃 breeze.mint',
    narration:
      '조건이 바람처럼 스치면,\n중괄호가 부드럽게 열려요.',
    syntax: 'breeze (조건) softly { … }',
    description:
      '조건이 참일 때 softly로 이어 블록이 피어납니다.\nsoftly는 MINT의 연결어예요.',
    tip: 'softly를 빼먹으면 블록이 열리지 않아요.',
    tryIt: '"sunny"를 "rainy"로 바꾸면 🌤가 피어날까요?',
  },
  {
    id: 'bloom',
    title: '꽃이 피어날 때',
    subtitle: 'bloom · 반복',
    chapterEmoji: '🌼',
    iconGradient: 'linear-gradient(135deg, #F2C8D5 0%, #D68FA8 100%)',
    keywordName: 'bloom',
    keywordColor: '#D68FA8',
    code: `// 꽃이 피어나듯, 반복해봅니다
plant count = 0

bloom (count < 3) softly {
  sparkle "🌼"
  plant count = count + 1
}
`,
    filename: '🌼 bloom.mint',
    narration:
      '무언가가 자연스럽게 피어나듯,\nbloom은 조건이 참인 동안 반복합니다.',
    syntax: 'bloom (조건) softly { … }',
    description:
      '조건이 참인 동안, 중괄호 안의 문장들이 조용히 피어나기를 반복해요.',
    tip: 'count를 늘리는 걸 잊으면, bloom은 영원히 피어나요.',
    tryIt: '3을 5로 바꾸면 꽃이 몇 송이 피어날까요?',
  },
  {
    id: 'petal',
    title: '꽃잎을 접고',
    subtitle: 'petal · 함수',
    chapterEmoji: '🌸',
    iconGradient: 'linear-gradient(135deg, #E5CEE5 0%, #C89CC8 100%)',
    keywordName: 'petal',
    keywordColor: '#C89CC8',
    code: `petal greet(name) {
  sparkle "hello, " + name
}

greet("minda")
`,
    filename: '🌸 petal.mint',
    narration:
      'petal로 이름 붙인 블록을 만들어요.\n꽃잎처럼 열고 닫을 수 있어요.',
    syntax: 'petal 이름(매개변수) { … }',
    description:
      '같은 동작을 여러 번 부르고 싶을 때, petal로 꽃잎을 접어두고 필요할 때 펼쳐요.',
    tip: '매개변수는 꽃잎 사이에 살짝 넣는 작은 전달물이에요.',
  },
  {
    id: 'gift',
    title: '선물을 건네며',
    subtitle: 'gift · 반환',
    chapterEmoji: '🎁',
    iconGradient: 'linear-gradient(135deg, #C8EDD2 0%, #5B9A6B 100%)',
    keywordName: 'gift',
    keywordColor: '#5B9A6B',
    code: `petal farewell(name) {
  gift "bye, " + name
}

sparkle farewell("minda")
`,
    filename: '🎁 gift.mint',
    narration:
      'gift로 값을 건네요.\n선물처럼 조용히 전달돼요.',
    syntax: 'gift 값',
    description:
      'petal 안에서 gift는 값을 바깥으로 건네줘요. 받은 사람은 sparkle로 꺼내 볼 수 있어요.',
    tip: 'gift는 petal 밖에서는 쓸 수 없어요 — 건넬 상대가 있을 때만.',
  },
];
