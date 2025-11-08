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

export type ParserErrorCode =
  | 'PARSER_UNEXPECTED_TOKEN'
  | 'PARSER_EXPECTED_TOKEN';

export interface ParserErrorDetailMap {
  PARSER_UNEXPECTED_TOKEN: {
    actual: string;
    expected?: string;
  };
  PARSER_EXPECTED_TOKEN: {
    expected: string;
    actual: string;
  };
}

export interface ParserErrorFormatParams<C extends ParserErrorCode> {
  code: C;
  position: SourcePosition;
  lexeme?: string;
  details: ParserErrorDetailMap[C];
}
