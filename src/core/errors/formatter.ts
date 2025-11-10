import { LexerError } from '@core/lexer/errors/errors.js';
import { ParserError } from '@core/parser/errors/errors.js';
import { EvaluatorError } from '@core/evaluator/errors/errors.js';
import type {
  LexerErrorCode,
  LexerErrorFormatParams,
  ParserErrorCode,
  ParserErrorFormatParams,
  EvaluatorErrorCode,
  EvaluatorErrorFormatParams,
} from '@core/errors/codes.js';

/**
 * 렉서 에러 메시지 생성 함수 맵
 */
const LEXER_MESSAGE_BUILDERS: {
  [K in LexerErrorCode]: (params: LexerErrorFormatParams<K>) => string;
} = {
  LEXER_UNEXPECTED_CHARACTER: ({ position, details }) => {
    const location = `line ${position.line}, column ${position.column}`;
    const char = details?.char ?? '';
    return `${location}: Unexpected character '${char}'.`;
  },
  LEXER_UNTERMINATED_STRING: ({ position }) => {
    const location = `line ${position.line}, column ${position.column}`;
    return `${location}: Unterminated string literal.`;
  },
};

/**
 * 파서 에러 메시지 생성 함수 맵
 */
const PARSER_MESSAGE_BUILDERS: {
  [K in ParserErrorCode]: (params: ParserErrorFormatParams<K>) => string;
} = {
  PARSER_UNEXPECTED_TOKEN: ({ position, details }) => {
    const location = `line ${position.line}, column ${position.column}`;
    const actual = details?.actual ?? 'unknown';
    const expected = details?.expected;
    if (expected) {
      return `${location}: Unexpected token '${actual}', expected '${expected}'.`;
    }
    return `${location}: Unexpected token '${actual}'.`;
  },
  PARSER_EXPECTED_TOKEN: ({ position, details }) => {
    const location = `line ${position.line}, column ${position.column}`;
    const expected = details?.expected ?? 'unknown';
    const actual = details?.actual ?? 'unknown';
    return `${location}: Expected '${expected}' but found '${actual}'.`;
  },
};

/**
 * 평가기 에러 메시지 생성 함수 맵
 */
const EVALUATOR_MESSAGE_BUILDERS: {
  [K in EvaluatorErrorCode]: (params: EvaluatorErrorFormatParams<K>) => string;
} = {
  EVALUATOR_UNDEFINED_IDENTIFIER: ({ details }) => {
    return `Undefined identifier "${details.name}".`;
  },
  EVALUATOR_INVALID_ASSIGNMENT_TARGET: ({ details }) => {
    return `Cannot assign to undeclared identifier "${details.name}".`;
  },
  EVALUATOR_NOT_CALLABLE: ({ details }) => {
    return `Cannot call value of type ${details.type}.`;
  },
  EVALUATOR_ARGUMENT_COUNT_MISMATCH: ({ details }) => {
    return `Expected ${details.expected} argument(s) but received ${details.received}.`;
  },
  EVALUATOR_RETURN_OUTSIDE_FUNCTION: () => {
    return '"gift" can only be used inside function bodies.';
  },
  EVALUATOR_TYPE_ERROR: ({ details }) => {
    const operands = details.operandTypes.join(' and ');
    return `Operator "${details.operator}" is not defined for operand types ${operands}.`;
  },
};

/**
 * 코드와 상세 정보를 바탕으로 렉서 에러 메시지를 생성한다.
 *
 * @param params 에러 포맷 파라미터
 * @returns 생성된 렉서 에러 메시지
 */
export function formatLexerErrorMessage<C extends LexerErrorCode>(
  params: LexerErrorFormatParams<C>
): string {
  const builder = LEXER_MESSAGE_BUILDERS[params.code] as (
    params: LexerErrorFormatParams<C>
  ) => string;

  if (!builder) {
    const { line, column } = params.position;
    return `line ${line}, column ${column}: Unknown lexer error (${params.code}).`;
  }

  return builder(params);
}

/**
 * 코드와 상세 정보를 바탕으로 파서 에러 메시지를 생성한다.
 *
 * @param params 에러 포맷 파라미터
 * @returns 생성된 파서 에러 메시지
 */
export function formatParserErrorMessage<C extends ParserErrorCode>(
  params: ParserErrorFormatParams<C>
): string {
  const builder = PARSER_MESSAGE_BUILDERS[params.code] as (
    params: ParserErrorFormatParams<C>
  ) => string;

  if (!builder) {
    const { line, column } = params.position;
    return `line ${line}, column ${column}: Unknown parser error (${params.code}).`;
  }

  return builder(params);
}

/**
 * 코드와 상세 정보를 바탕으로 평가기 에러 메시지를 생성한다.
 *
 * @param params 에러 포맷 파라미터
 * @returns 생성된 평가기 에러 메시지
 */
export function formatEvaluatorErrorMessage<C extends EvaluatorErrorCode>(
  params: EvaluatorErrorFormatParams<C>
): string {
  const builder = EVALUATOR_MESSAGE_BUILDERS[params.code] as (
    params: EvaluatorErrorFormatParams<C>
  ) => string;

  if (!builder) {
    return `Unknown evaluator error (${params.code}).`;
  }

  return builder(params);
}

/**
 * LexerError 인스턴스를 받아 메시지를 생성한다.
 *
 * @param error LexerError 인스턴스
 * @returns 생성된 LexerError 메시지
 */
export function formatLexerError<C extends LexerErrorCode>(
  error: LexerError<C>
): string {
  return formatLexerErrorMessage<C>({
    code: error.code,
    position: error.position,
    lexeme: error.lexeme,
    details: error.details,
  });
}

/**
 * ParserError 인스턴스를 받아 메시지를 생성한다.
 *
 * @param error ParserError 인스턴스
 * @returns 생성된 ParserError 메시지
 */
export function formatParserError<C extends ParserErrorCode>(
  error: ParserError<C>
): string {
  return formatParserErrorMessage<C>({
    code: error.code,
    position: error.position,
    lexeme: error.lexeme,
    details: error.details,
  });
}

/**
 * EvaluatorError 인스턴스를 받아 메시지를 생성한다.
 *
 * @param error EvaluatorError 인스턴스
 * @returns 생성된 EvaluatorError 메시지
 */
export function formatEvaluatorError<C extends EvaluatorErrorCode>(
  error: EvaluatorError<C>
): string {
  return formatEvaluatorErrorMessage<C>({
    code: error.code,
    details: error.details,
  });
}
