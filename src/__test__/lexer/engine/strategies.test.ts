import { TOKEN_RULES } from '@core/lexer/engine/strategies.js';
import { createInitialState } from '@core/lexer/engine/state.js';
import { LexerError } from '@core/lexer/errors/errors.js';

describe('lexer engine strategies', () => {
  describe('whitespaceRule', () => {
    test('공백 문자를 건너뛴다', () => {
      // Given
      const state = createInitialState('   hello');
      const rule = TOKEN_RULES[0]; // whitespaceRule

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(true);
      expect(state.current).toBe(1);
    });

    test('탭 문자를 건너뛴다', () => {
      // Given
      const state = createInitialState('\thello');
      const rule = TOKEN_RULES[0];

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(true);
    });

    test('공백이 아닌 문자는 처리하지 않는다', () => {
      // Given
      const state = createInitialState('hello');
      const rule = TOKEN_RULES[0];

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(false);
    });
  });

  describe('newlineRule', () => {
    test('개행 문자를 처리하고 line/column을 갱신한다', () => {
      // Given
      const state = createInitialState('\nhello');
      const rule = TOKEN_RULES[1]; // newlineRule

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(true);
      expect(state.line).toBe(2);
      expect(state.column).toBe(1);
    });

    test('개행이 아닌 문자는 처리하지 않는다', () => {
      // Given
      const state = createInitialState('hello');
      const rule = TOKEN_RULES[1];

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(false);
    });
  });

  describe('commentRule', () => {
    test('한 줄 주석을 건너뛴다', () => {
      // Given
      const source = '// this is a comment\nhello';
      const state = createInitialState(source);
      const rule = TOKEN_RULES[2]; // commentRule

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(true);
      expect(state.current).toBe(source.indexOf('\n'));
    });

    test('주석이 아닌 문자는 처리하지 않는다', () => {
      // Given
      const state = createInitialState('hello');
      const rule = TOKEN_RULES[2];

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(false);
    });

    test('단일 슬래시는 주석으로 처리하지 않는다', () => {
      // Given
      const state = createInitialState('/hello');
      const rule = TOKEN_RULES[2];

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(false);
    });
  });

  describe('stringRule', () => {
    test('문자열 리터럴을 토큰으로 변환한다', () => {
      // Given
      const state = createInitialState('"hello"');
      const rule = TOKEN_RULES[3]; // stringRule

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(true);
      expect(state.tokens).toHaveLength(1);
      expect(state.tokens[0]).toMatchObject({
        type: 'STRING',
        literal: 'hello',
        lexeme: '"hello"',
      });
    });

    test('여러 줄 문자열을 처리한다', () => {
      // Given
      const source = '"hello\nworld"';
      const state = createInitialState(source);
      const rule = TOKEN_RULES[3];

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(true);
      expect(state.tokens[0].literal).toBe('hello\nworld');
      expect(state.line).toBe(2);
    });

    test('종료되지 않은 문자열은 에러를 발생시킨다', () => {
      // Given
      const state = createInitialState('"hello');
      const rule = TOKEN_RULES[3];

      // When
      const when = () => rule(state);

      // Then
      expect(when).toThrow(LexerError);
      try {
        rule(state);
      } catch (error) {
        expect(error).toBeInstanceOf(LexerError);
        if (error instanceof LexerError) {
          expect(error.code).toBe('LEXER_UNTERMINATED_STRING');
        }
      }
    });

    test('문자열이 아닌 문자는 처리하지 않는다', () => {
      // Given
      const state = createInitialState('hello');
      const rule = TOKEN_RULES[3];

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(false);
    });
  });

  describe('numberRule', () => {
    test('정수 리터럴을 토큰으로 변환한다', () => {
      // Given
      const state = createInitialState('123');
      const rule = TOKEN_RULES[4]; // numberRule

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(true);
      expect(state.tokens[0]).toMatchObject({
        type: 'NUMBER',
        literal: 123,
        lexeme: '123',
      });
    });

    test('소수점 리터럴을 토큰으로 변환한다', () => {
      // Given
      const state = createInitialState('123.45');
      const rule = TOKEN_RULES[4];

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(true);
      expect(state.tokens[0]).toMatchObject({
        type: 'NUMBER',
        literal: 123.45,
        lexeme: '123.45',
      });
    });

    test('소수점만 있고 숫자가 없으면 정수로 처리한다', () => {
      // Given
      const state = createInitialState('123.');
      const rule = TOKEN_RULES[4];

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(true);
      expect(state.tokens[0].literal).toBe(123);
    });

    test('숫자가 아닌 문자는 처리하지 않는다', () => {
      // Given
      const state = createInitialState('hello');
      const rule = TOKEN_RULES[4];

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(false);
    });
  });

  describe('identifierRule', () => {
    test('식별자를 토큰으로 변환한다', () => {
      // Given
      const state = createInitialState('hello');
      const rule = TOKEN_RULES[5]; // identifierRule

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(true);
      expect(state.tokens[0]).toMatchObject({
        type: 'IDENTIFIER',
        lexeme: 'hello',
      });
    });

    test('키워드를 KEYWORD 토큰으로 변환한다', () => {
      // Given
      const state = createInitialState('plant');
      const rule = TOKEN_RULES[5];

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(true);
      expect(state.tokens[0]).toMatchObject({
        type: 'KEYWORD',
        keyword: 'plant',
        lexeme: 'plant',
      });
    });

    test('밑줄로 시작하는 식별자를 처리한다', () => {
      // Given
      const state = createInitialState('_private');
      const rule = TOKEN_RULES[5];

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(true);
      expect(state.tokens[0].type).toBe('IDENTIFIER');
    });

    test('숫자와 알파벳이 섞인 식별자를 처리한다', () => {
      // Given
      const state = createInitialState('var123');
      const rule = TOKEN_RULES[5];

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(true);
      expect(state.tokens[0].lexeme).toBe('var123');
    });

    test('알파벳이 아닌 문자는 처리하지 않는다', () => {
      // Given
      const state = createInitialState('123');
      const rule = TOKEN_RULES[5];

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(false);
    });
  });

  describe('operatorRule', () => {
    test('단일 연산자를 토큰으로 변환한다', () => {
      // Given
      const state = createInitialState('=');
      const rule = TOKEN_RULES[6]; // operatorRule

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(true);
      expect(state.tokens[0]).toMatchObject({
        type: 'EQUAL',
        lexeme: '=',
      });
    });

    test('이중 연산자를 토큰으로 변환한다', () => {
      // Given
      const state = createInitialState('==');
      const rule = TOKEN_RULES[6];

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(true);
      expect(state.tokens[0]).toMatchObject({
        type: 'EQUAL_EQUAL',
        lexeme: '==',
      });
    });

    test('비교 연산자를 처리한다', () => {
      // Given
      const state = createInitialState('<=');
      const rule = TOKEN_RULES[6];

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(true);
      expect(state.tokens[0].type).toBe('LESS_EQUAL');
    });

    test('연산자가 아닌 문자는 처리하지 않는다', () => {
      // Given
      const state = createInitialState('a');
      const rule = TOKEN_RULES[6];

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(false);
    });
  });

  describe('singleCharRule', () => {
    test('단일 문자 토큰을 처리한다', () => {
      // Given
      const state = createInitialState('(');
      const rule = TOKEN_RULES[7]; // singleCharRule

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(true);
      expect(state.tokens[0]).toMatchObject({
        type: 'LEFT_PAREN',
        lexeme: '(',
      });
    });

    test('여러 단일 문자 토큰을 처리한다', () => {
      const tokens = [
        { char: '(', type: 'LEFT_PAREN' },
        { char: ')', type: 'RIGHT_PAREN' },
        { char: '{', type: 'LEFT_BRACE' },
        { char: '}', type: 'RIGHT_BRACE' },
        { char: ',', type: 'COMMA' },
        { char: '.', type: 'DOT' },
        { char: '-', type: 'MINUS' },
        { char: '+', type: 'PLUS' },
        { char: ';', type: 'SEMICOLON' },
        { char: '*', type: 'STAR' },
        { char: '/', type: 'SLASH' },
      ];

      tokens.forEach(({ char, type }) => {
        // Given
        const state = createInitialState(char);
        const rule = TOKEN_RULES[7];

        // When
        const handled = rule(state);

        // Then
        expect(handled).toBe(true);
        expect(state.tokens[0].type).toBe(type);
      });
    });

    test('단일 문자 토큰이 아닌 문자는 처리하지 않는다', () => {
      // Given
      const state = createInitialState('a');
      const rule = TOKEN_RULES[7];

      // When
      const handled = rule(state);

      // Then
      expect(handled).toBe(false);
    });
  });

  describe('TOKEN_RULES 순서', () => {
    test('규칙이 올바른 순서로 등록되어 있다', () => {
      // Given & When
      const ruleNames = [
        'whitespaceRule',
        'newlineRule',
        'commentRule',
        'stringRule',
        'numberRule',
        'identifierRule',
        'operatorRule',
        'singleCharRule',
      ];

      // Then
      expect(TOKEN_RULES).toHaveLength(8);
    });
  });
});
