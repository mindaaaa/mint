import type { BlockStatementNode, StatementNode } from '@core/ast/nodes.js';
import { advance, checkType, peek } from '@core/parser/engine/state.js';
import {
  consumeIdentifier,
  consumeKeyword,
  consumeType,
  matchKeyword,
  matchType,
} from '@core/parser/engine/helpers.js';
import { ExpressionParser } from '@core/parser/engine/expressions.js';
import type { ParserState } from '@core/parser/engine/state.js';

/**
 * 문장(Statement) 파서를 담당하는 헬퍼 클래스.
 * 변수 선언, 함수 선언, 조건/반복문 등을 파싱한다.
 */
export class StatementParser {
  private readonly expressionParser: ExpressionParser;

  constructor(private readonly state: ParserState) {
    this.expressionParser = new ExpressionParser(state);
  }

  /**
   * 선언 또는 일반 문장을 파싱한다.
   * @returns StatementNode
   */
  declaration(): StatementNode {
    try {
      if (matchKeyword(this.state, 'petal')) {
        return this.functionDeclaration();
      }

      if (matchKeyword(this.state, 'plant')) {
        return this.variableDeclaration();
      }

      return this.statement();
    } catch (error) {
      this.synchronize();
      throw error;
    }
  }

  /**
   * 함수 선언을 파싱한다.
   * @returns StatementNode
   */
  private functionDeclaration(): StatementNode {
    const name = consumeIdentifier(
      this.state,
      'Expected function name after "petal".'
    );
    consumeType(this.state, 'LEFT_PAREN', 'Expected "(" after function name.');

    const params: ReturnType<typeof consumeIdentifier>[] = [];

    while (!checkType(this.state, 'RIGHT_PAREN')) {
      params.push(
        consumeIdentifier(
          this.state,
          'Expected parameter name in function declaration.'
        )
      );
      if (!matchType(this.state, 'COMMA')) break;
    }

    consumeType(
      this.state,
      'RIGHT_PAREN',
      'Expected ")" after parameter list.'
    );

    const body = this.blockStatement();

    return {
      type: 'FunctionDeclaration',
      name,
      params,
      body,
    };
  }

  /**
   * 변수 선언을 파싱한다.
   */
  private variableDeclaration(): StatementNode {
    const identifier = consumeIdentifier(
      this.state,
      'Expected variable name after "plant".'
    );
    const initializer = matchType(this.state, 'EQUAL')
      ? this.expressionParser.expression()
      : undefined;

    this.optionalSemicolon();

    return {
      type: 'VariableDeclaration',
      identifier,
      initializer,
    };
  }

  /**
   * 일반 statement를 파싱한다.
   * @returns StatementNode
   */
  private statement(): StatementNode {
    const keywordHandlers: Record<string, () => StatementNode> = {
      breeze: () => this.ifStatement(),
      bloom: () => this.whileStatement(),
      gift: () => this.returnStatement(),
      sparkle: () => this.sparkleStatement(),
    };

    for (const [keyword, handler] of Object.entries(keywordHandlers)) {
      if (matchKeyword(this.state, keyword)) {
        return handler();
      }
    }

    if (matchType(this.state, 'LEFT_BRACE')) {
      return this.finishBlock();
    }

    return this.expressionStatement();
  }

  /**
   * if 문을 파싱한다.
   * @returns StatementNode
   */
  private ifStatement(): StatementNode {
    consumeType(this.state, 'LEFT_PAREN', 'Expected "(" after "breeze".');
    const condition = this.expressionParser.expression();
    consumeType(this.state, 'RIGHT_PAREN', 'Expected ")" after condition.');
    consumeKeyword(this.state, 'softly', 'Expected "softly" before if block.');

    const consequent = this.blockStatement();

    return {
      type: 'IfStatement',
      condition,
      consequent,
    };
  }

  /**
   * while 문을 파싱한다.
   * @returns StatementNode
   */
  private whileStatement(): StatementNode {
    consumeType(this.state, 'LEFT_PAREN', 'Expected "(" after "bloom".');
    const condition = this.expressionParser.expression();
    consumeType(this.state, 'RIGHT_PAREN', 'Expected ")" after condition.');
    consumeKeyword(
      this.state,
      'softly',
      'Expected "softly" before bloom block.'
    );

    const body = this.blockStatement();

    return {
      type: 'WhileStatement',
      condition,
      body,
    };
  }

  /**
   * return 문을 파싱한다.
   * @returns StatementNode
   */
  private returnStatement(): StatementNode {
    const shouldParseArgument =
      !checkType(this.state, 'SEMICOLON') &&
      !checkType(this.state, 'RIGHT_BRACE') &&
      !checkType(this.state, 'EOF');

    const argument = shouldParseArgument
      ? this.expressionParser.expression()
      : undefined;

    this.optionalSemicolon();

    return {
      type: 'ReturnStatement',
      argument,
    };
  }

  /**
   * sparkle 문을 파싱한다.
   * @returns StatementNode
   */
  private sparkleStatement(): StatementNode {
    const expression = this.expressionParser.expression();
    this.optionalSemicolon();

    return {
      type: 'SparkleStatement',
      expression,
    };
  }

  /**
   * expression 문을 파싱한다.
   * @returns StatementNode
   */
  private expressionStatement(): StatementNode {
    const expression = this.expressionParser.expression();
    this.optionalSemicolon();

    return {
      type: 'ExpressionStatement',
      expression,
    };
  }

  /**
   * 블록 { ... }을 파싱한다.
   * @returns BlockStatementNode
   */
  private blockStatement(): BlockStatementNode {
    consumeType(this.state, 'LEFT_BRACE', 'Expected "{" to start block.');
    return this.finishBlock();
  }

  /**
   * 블록 내부 문장을 파싱한다.
   * @returns BlockStatementNode
   */
  private finishBlock(): BlockStatementNode {
    const body: StatementNode[] = [];

    while (!checkType(this.state, 'RIGHT_BRACE') && !this.isAtEnd()) {
      body.push(this.declaration());
    }
    consumeType(this.state, 'RIGHT_BRACE', 'Expected "}" to close block.');

    return { type: 'BlockStatement', body };
  }

  /**
   * 선택적 세미콜론을 소비한다.
   */
  private optionalSemicolon(): void {
    matchType(this.state, 'SEMICOLON');
  }

  /**
   * 오류 발생 시 다음 문장 경계까지 소비하여 파서를 복구한다.
   */
  private synchronize(): void {
    const boundaryKeywords = new Set<string>([
      'plant' /* 변수 선언 */,
      'petal' /* 함수 선언 */,
      'breeze' /* if */,
      'bloom' /* while */,
      'gift' /* return */,
      'sparkle' /* print or custom statement */,
    ] as const);

    advance(this.state);

    while (!this.isAtEnd()) {
      if (peek(this.state).type === 'SEMICOLON') {
        return;
      }

      const nextToken = peek(this.state);
      const isBoundaryKeyword =
        nextToken.type === 'KEYWORD' && boundaryKeywords.has(nextToken.lexeme);
      const isRightBrace = nextToken.type === 'RIGHT_BRACE';

      if (isBoundaryKeyword || isRightBrace) {
        return;
      }

      advance(this.state);
    }
  }

  /**
   * 파서가 EOF에 도달했는지 확인한다.
   */
  private isAtEnd(): boolean {
    return peek(this.state).type === 'EOF';
  }
}
