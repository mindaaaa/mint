import type { Token } from '@core/lexer/tokens.js';
import type { ProgramNode, StatementNode } from '@core/ast/nodes.js';
import { createParserState, isAtEnd } from '@core/parser/engine/state.js';
import { StatementParser } from '@core/parser/engine/statements.js';

/**
 * 토큰 배열을 AST Program 노드로 파싱한다.
 * @param tokens 토큰 배열
 * @returns AST Program 노드
 */
export function parse(tokens: Token[]): ProgramNode {
  const state = createParserState(tokens);
  const statements = new StatementParser(state);
  const body: StatementNode[] = [];

  while (!isAtEnd(state)) {
    body.push(statements.declaration());
  }

  return { type: 'Program', body };
}
