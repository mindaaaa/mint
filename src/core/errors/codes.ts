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

export type EvaluatorErrorCode =
  | 'EVALUATOR_UNDEFINED_IDENTIFIER'
  | 'EVALUATOR_INVALID_ASSIGNMENT_TARGET'
  | 'EVALUATOR_NOT_CALLABLE'
  | 'EVALUATOR_ARGUMENT_COUNT_MISMATCH'
  | 'EVALUATOR_RETURN_OUTSIDE_FUNCTION'
  | 'EVALUATOR_TYPE_ERROR';

export interface EvaluatorErrorDetailMap {
  EVALUATOR_UNDEFINED_IDENTIFIER: {
    name: string;
  };
  EVALUATOR_INVALID_ASSIGNMENT_TARGET: {
    name: string;
  };
  EVALUATOR_NOT_CALLABLE: {
    type: string;
  };
  EVALUATOR_ARGUMENT_COUNT_MISMATCH: {
    expected: number;
    received: number;
  };
  EVALUATOR_RETURN_OUTSIDE_FUNCTION: undefined;
  EVALUATOR_TYPE_ERROR: {
    operator: string;
    operandTypes: string[];
  };
}

export interface EvaluatorErrorFormatParams<C extends EvaluatorErrorCode> {
  code: C;
  details: EvaluatorErrorDetailMap[C];
}
