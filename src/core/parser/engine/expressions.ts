import type { ExpressionNode } from '@core/ast/nodes.js';
import type { ParserState } from '@core/parser/engine/state.js';
import {
  advance,
  checkType,
  peek,
  previous,
} from '@core/parser/engine/state.js';
import { consumeType, matchType } from '@core/parser/engine/helpers.js';
import type { Token } from '@core/lexer/tokens.js';
import { createParserError } from '@core/errors/factory.js';
import type {
  ParserErrorCode,
  ParserErrorDetailMap,
} from '@core/errors/codes.js';

export class ExpressionParser {
  constructor(private readonly state: ParserState) {}

  /**
   * 최상위 표현식을 파싱한다.
   * @returns ExpressionNode
   */
  expression(): ExpressionNode {
    return this.assignment();
  }

  /**
   * 대입 표현식을 파싱한다.
   * @returns ExpressionNode
   */
  private assignment(): ExpressionNode {
    const expr = this.equality();

    if (matchType(this.state, 'EQUAL')) {
      const equals = previous(this.state);
      const value = this.assignment();

      if (expr.type === 'IdentifierExpression') {
        return {
          type: 'AssignmentExpression',
          identifier: expr,
          value,
        };
      }

      this.throwError(equals, 'PARSER_UNEXPECTED_TOKEN', {
        actual: equals.lexeme,
        expected: 'assignable target',
      });
    }

    return expr;
  }

  /**
   * ==, != 비교 표현식을 파싱한다.
   * @returns ExpressionNode
   */
  private equality(): ExpressionNode {
    let expr = this.comparison();

    while (this.matchOperators('EQUAL_EQUAL', 'BANG_EQUAL')) {
      const operator = previous(this.state).lexeme;
      const right = this.comparison();

      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
      };
    }

    return expr;
  }

  /**
   * <, >, <=, >= 비교 표현식을 파싱한다.
   * @returns ExpressionNode
   */
  private comparison(): ExpressionNode {
    let expr = this.term();

    while (
      this.matchOperators('GREATER', 'GREATER_EQUAL', 'LESS', 'LESS_EQUAL')
    ) {
      const operator = previous(this.state).lexeme;
      const right = this.term();

      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
      };
    }

    return expr;
  }

  /**
   * +, - 표현식을 파싱한다.
   * @returns ExpressionNode
   */
  private term(): ExpressionNode {
    let expr = this.factor();

    while (this.matchOperators('PLUS', 'MINUS')) {
      const operator = previous(this.state).lexeme;
      const right = this.factor();

      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
      };
    }

    return expr;
  }

  /**
   * *, / 표현식을 파싱한다.
   * @returns ExpressionNode
   */
  private factor(): ExpressionNode {
    let expr = this.unary();

    while (this.matchOperators('STAR', 'SLASH')) {
      const operator = previous(this.state).lexeme;
      const right = this.unary();

      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
      };
    }

    return expr;
  }

  /**
   * 단항 표현식(부정, 음수)을 파싱한다.
   * @returns ExpressionNode
   */
  private unary(): ExpressionNode {
    if (this.matchOperators('BANG', 'MINUS')) {
      const operator = previous(this.state).lexeme;
      const argument = this.unary();

      return {
        type: 'UnaryExpression',
        operator,
        argument,
      };
    }

    return this.call();
  }

  /**
   * 함수 호출 체인을 파싱한다.
   * @returns ExpressionNode
   */
  private call(): ExpressionNode {
    let expr = this.primary();

    while (true) {
      if (matchType(this.state, 'LEFT_PAREN')) {
        expr = this.finishCall(expr);
      } else {
        break;
      }
    }

    return expr;
  }

  /**
   * 함수 호출 인수 리스트를 파싱한다.
   * @returns ExpressionNode
   */
  private finishCall(callee: ExpressionNode): ExpressionNode {
    const args: ExpressionNode[] = [];

    while (!checkType(this.state, 'RIGHT_PAREN')) {
      args.push(this.expression());

      if (!matchType(this.state, 'COMMA')) {
        break;
      }
    }

    consumeType(this.state, 'RIGHT_PAREN', 'Expected ")" after arguments.');

    return {
      type: 'CallExpression',
      callee,
      args,
    };
  }

  /**
   * 리터럴, 식별자, 그룹핑을 처리한다.
   * @returns ExpressionNode
   */
  private primary(): ExpressionNode {
    const token = peek(this.state);

    if (matchType(this.state, 'NUMBER')) {
      return {
        type: 'LiteralExpression',
        value: Number(previous(this.state).lexeme),
      };
    }

    if (matchType(this.state, 'STRING')) {
      const prev = previous(this.state);
      return {
        type: 'LiteralExpression',
        value: prev.literal ?? prev.lexeme,
      };
    }

    if (matchType(this.state, 'IDENTIFIER')) {
      const prev = previous(this.state);

      if (typeof prev.literal === 'boolean') {
        return {
          type: 'LiteralExpression',
          value: prev.literal,
        };
      }

      return {
        type: 'IdentifierExpression',
        name: previous(this.state).lexeme,
      };
    }

    if (matchType(this.state, 'LEFT_PAREN')) {
      const expr = this.expression();
      consumeType(this.state, 'RIGHT_PAREN', 'Expected ")" after expression.');
      return {
        type: 'GroupingExpression',
        expression: expr,
      };
    }

    throw createParserError(token, 'PARSER_UNEXPECTED_TOKEN', {
      actual: token.lexeme,
    });
  }

  /**
   * 지정한 타입 목록 중 하나와 일치하면 토큰을 소비한다.
   * @param types 토큰 타입 목록
   * @returns 일치하면 true, 아니면 false
   */
  private matchOperators(...types: Token['type'][]): boolean {
    for (const type of types) {
      if (matchType(this.state, type)) {
        return true;
      }
    }
    return false;
  }

  /**
   * 파서 에러를 던진다.
   * @param token 에러가 발생한 토큰
   * @param code 에러 코드
   * @param details 에러 상세 정보
   * @returns 에러를 던진 후 프로그램 종료
   */
  private throwError<C extends ParserErrorCode>(
    token: Token,
    code: C,
    details: ParserErrorDetailMap[C]
  ): never {
    throw createParserError(token, code, details);
  }
}
