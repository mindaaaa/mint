import { StreamLanguage, HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Tag } from '@lezer/highlight';
import type { Extension } from '@codemirror/state';

export const MINT_KEYWORDS = [
  'plant',
  'sparkle',
  'breeze',
  'bloom',
  'petal',
  'gift',
  'softly',
] as const;
export type MintKeyword = (typeof MINT_KEYWORDS)[number];

// workbench 팔레트에 맞춘 MINT 키워드 색 (proposal D — quiet workbench)
export const MINT_COLORS = {
  plant: '#315E3D',
  gift: '#315E3D',
  sparkle: '#B58540',
  breeze: '#79526A',
  bloom: '#A26449',
  petal: '#A26449',
  softly: '#899472',
  string: '#735B3E',
  number: '#735B3E',
  comment: '#8D9686',
  operator: '#899472',
  punctuation: '#1C1E1A',
  identifier: '#404540',
} as const;

export type MintTokenType =
  | MintKeyword
  | 'string'
  | 'number'
  | 'comment'
  | 'operator'
  | 'punctuation'
  | 'identifier'
  | 'whitespace';

export interface MintToken {
  type: MintTokenType;
  value: string;
}

const KEYWORD_SET: ReadonlySet<string> = new Set(MINT_KEYWORDS);

export function tokenizeMint(source: string): MintToken[] {
  const tokens: MintToken[] = [];
  const len = source.length;
  let i = 0;

  while (i < len) {
    const ch = source[i]!;

    if (/\s/.test(ch)) {
      let j = i;
      while (j < len && /\s/.test(source[j]!)) j++;
      tokens.push({ type: 'whitespace', value: source.slice(i, j) });
      i = j;
      continue;
    }

    if (ch === '/' && source[i + 1] === '/') {
      let j = i + 2;
      while (j < len && source[j] !== '\n') j++;
      tokens.push({ type: 'comment', value: source.slice(i, j) });
      i = j;
      continue;
    }

    if (ch === '"') {
      let j = i + 1;
      while (j < len && source[j] !== '"') {
        if (source[j] === '\\' && j + 1 < len) j++;
        j++;
      }
      if (j < len) j++;
      tokens.push({ type: 'string', value: source.slice(i, j) });
      i = j;
      continue;
    }

    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < len && /[0-9.]/.test(source[j]!)) j++;
      tokens.push({ type: 'number', value: source.slice(i, j) });
      i = j;
      continue;
    }

    if (/[a-zA-Z_]/.test(ch)) {
      let j = i;
      while (j < len && /[a-zA-Z0-9_]/.test(source[j]!)) j++;
      const word = source.slice(i, j);
      if (KEYWORD_SET.has(word)) {
        tokens.push({ type: word as MintKeyword, value: word });
      } else {
        tokens.push({ type: 'identifier', value: word });
      }
      i = j;
      continue;
    }

    const two = source.slice(i, i + 2);
    if (two === '==' || two === '!=' || two === '<=' || two === '>=') {
      tokens.push({ type: 'operator', value: two });
      i += 2;
      continue;
    }
    if (/[+\-*/=<>]/.test(ch)) {
      tokens.push({ type: 'operator', value: ch });
      i++;
      continue;
    }

    if (/[(){},.;]/.test(ch)) {
      tokens.push({ type: 'punctuation', value: ch });
      i++;
      continue;
    }

    tokens.push({ type: 'identifier', value: ch });
    i++;
  }

  return tokens;
}

export function getTokenColor(type: MintTokenType): string {
  if (type === 'whitespace') return 'inherit';
  return MINT_COLORS[type] ?? '#3E5E43';
}

export function isKeywordToken(type: MintTokenType): type is MintKeyword {
  return KEYWORD_SET.has(type);
}

export type KeywordCounts = Record<MintKeyword, number>;

export function countKeywords(source: string): KeywordCounts {
  const counts: KeywordCounts = {
    plant: 0,
    sparkle: 0,
    breeze: 0,
    bloom: 0,
    petal: 0,
    gift: 0,
    softly: 0,
  };
  for (const tok of tokenizeMint(source)) {
    if (isKeywordToken(tok.type)) {
      counts[tok.type]++;
    }
  }
  return counts;
}

const mintTags = {
  plantGift: Tag.define(),
  sparkle: Tag.define(),
  breeze: Tag.define(),
  bloom: Tag.define(),
  petal: Tag.define(),
  softly: Tag.define(),
  string: Tag.define(),
  number: Tag.define(),
  comment: Tag.define(),
  operator: Tag.define(),
};

export const mintLanguage = StreamLanguage.define({
  name: 'mint',
  token(stream) {
    if (stream.eatSpace()) return null;

    if (stream.match('//')) {
      stream.skipToEnd();
      return 'comment';
    }

    if (stream.match(/^"(?:[^"\\]|\\.)*"/)) return 'string';
    if (stream.match(/^\d+(?:\.\d+)?/)) return 'number';

    if (stream.match(/^[a-zA-Z_][a-zA-Z0-9_]*/)) {
      const word = stream.current();
      if (word === 'plant' || word === 'gift') return 'plantGift';
      if (word === 'sparkle') return 'sparkle';
      if (word === 'breeze') return 'breeze';
      if (word === 'bloom') return 'bloom';
      if (word === 'petal') return 'petal';
      if (word === 'softly') return 'softly';
      return null;
    }

    if (stream.match(/^(?:==|!=|<=|>=|[+\-*/<>=])/)) return 'operator';

    stream.next();
    return null;
  },
  tokenTable: {
    plantGift: mintTags.plantGift,
    sparkle: mintTags.sparkle,
    breeze: mintTags.breeze,
    bloom: mintTags.bloom,
    petal: mintTags.petal,
    softly: mintTags.softly,
    string: mintTags.string,
    number: mintTags.number,
    comment: mintTags.comment,
    operator: mintTags.operator,
  },
});

const mintHighlightStyle = HighlightStyle.define([
  { tag: mintTags.plantGift, color: MINT_COLORS.plant, fontWeight: '500' },
  { tag: mintTags.sparkle, color: MINT_COLORS.sparkle, fontWeight: '500' },
  { tag: mintTags.breeze, color: MINT_COLORS.breeze, fontWeight: '500' },
  { tag: mintTags.bloom, color: MINT_COLORS.bloom, fontWeight: '500' },
  { tag: mintTags.petal, color: MINT_COLORS.petal, fontWeight: '500' },
  { tag: mintTags.softly, color: MINT_COLORS.softly },
  { tag: mintTags.string, color: MINT_COLORS.string },
  { tag: mintTags.number, color: MINT_COLORS.number },
  { tag: mintTags.comment, color: MINT_COLORS.comment, fontStyle: 'italic' },
  { tag: mintTags.operator, color: MINT_COLORS.operator },
]);

export const mintExtension: Extension = [mintLanguage, syntaxHighlighting(mintHighlightStyle)];
