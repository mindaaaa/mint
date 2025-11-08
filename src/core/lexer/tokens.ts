export type TokenType =
  | 'LEFT_PAREN'
  | 'RIGHT_PAREN'
  | 'LEFT_BRACE'
  | 'RIGHT_BRACE'
  | 'COMMA'
  | 'DOT'
  | 'MINUS'
  | 'PLUS'
  | 'SEMICOLON'
  | 'SLASH'
  | 'STAR'
  | 'BANG'
  | 'BANG_EQUAL'
  | 'EQUAL'
  | 'EQUAL_EQUAL'
  | 'GREATER'
  | 'GREATER_EQUAL'
  | 'LESS'
  | 'LESS_EQUAL'
  | 'IDENTIFIER'
  | 'STRING'
  | 'NUMBER'
  | 'KEYWORD'
  | 'EOF';

export type KeywordType =
  | 'plant'
  | 'breeze'
  | 'bloom'
  | 'petal'
  | 'gift'
  | 'sparkle'
  | 'softly';

export const KEYWORDS: Record<string, KeywordType> = {
  plant: 'plant',
  breeze: 'breeze',
  bloom: 'bloom',
  petal: 'petal',
  gift: 'gift',
  sparkle: 'sparkle',
  softly: 'softly',
};

export interface SourcePosition {
  line: number;
  column: number;
}

export interface Token {
  type: TokenType;
  lexeme: string;
  literal?: string | number | boolean | null;
  position: SourcePosition;
  keyword?: KeywordType /* Keyword 토큰의 경우, `keyword` 프로퍼티에 키워드 값을 저장한다. */;
}
