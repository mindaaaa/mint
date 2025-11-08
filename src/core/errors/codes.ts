import type { SourcePosition } from '@core/lexer/tokens.js';

export type LexerErrorCode =
  | 'LEXER_UNEXPECTED_CHARACTER'
  | 'LEXER_UNTERMINATED_STRING';

export interface LexerErrorDetailMap {
  LEXER_UNEXPECTED_CHARACTER: {
    char: string;
  };
  LEXER_UNTERMINATED_STRING: undefined;
}

export interface LexerErrorFormatParams<C extends LexerErrorCode> {
  code: C;
  position: SourcePosition;
  lexeme?: string;
  details: LexerErrorDetailMap[C];
}
