import {
  addToken,
  advance,
  createInitialState,
  currentLexeme,
  isAtEnd,
  markTokenStart,
  match,
  newLine,
  peek,
  peekNext,
  sliceSource,
  type LexerState,
} from '@core/lexer/engine/state.js';

describe('lexer engine state', () => {
  describe('createInitialState', () => {
    test('초기 상태를 올바르게 생성한다', () => {
      // Given
      const source = 'plant x = 1';

      // When
      const state = createInitialState(source);

      // Then
      expect(state.source).toBe(source);
      expect(state.tokens).toEqual([]);
      expect(state.start).toBe(0);
      expect(state.current).toBe(0);
      expect(state.line).toBe(1);
      expect(state.column).toBe(1);
    });

    test('빈 문자열로도 초기 상태를 생성할 수 있다', () => {
      // Given
      const source = '';

      // When
      const state = createInitialState(source);

      // Then
      expect(state.source).toBe('');
      expect(state.tokens).toEqual([]);
      expect(state.current).toBe(0);
    });
  });

  describe('markTokenStart', () => {
    test('현재 위치를 토큰 시작 지점으로 표시한다', () => {
      // Given
      const state = createInitialState('hello');
      state.current = 3;

      // When
      markTokenStart(state);

      // Then
      expect(state.start).toBe(3);
    });
  });

  describe('isAtEnd', () => {
    test('소스 끝에 도달했을 때 true를 반환한다', () => {
      // Given
      const state = createInitialState('hi');
      state.current = 2;

      // When
      const result = isAtEnd(state);

      // Then
      expect(result).toBe(true);
    });

    test('소스 끝을 넘어섰을 때 true를 반환한다', () => {
      // Given
      const state = createInitialState('hi');
      state.current = 5;

      // When
      const result = isAtEnd(state);

      // Then
      expect(result).toBe(true);
    });

    test('소스 중간에 있을 때 false를 반환한다', () => {
      // Given
      const state = createInitialState('hello');
      state.current = 2;

      // When
      const result = isAtEnd(state);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('advance', () => {
    test('현재 문자를 소비하고 다음 위치로 이동한다', () => {
      // Given
      const state = createInitialState('abc');
      state.current = 0;

      // When
      const char = advance(state);

      // Then
      expect(char).toBe('a');
      expect(state.current).toBe(1);
      expect(state.column).toBe(2);
    });

    test('컬럼 위치가 증가한다', () => {
      // Given
      const state = createInitialState('abc');
      state.column = 5;

      // When
      advance(state);

      // Then
      expect(state.column).toBe(6);
    });

    test('끝에 도달하면 널 문자를 반환한다', () => {
      // Given
      const state = createInitialState('a');
      state.current = 1;

      // When
      const char = advance(state);

      // Then
      expect(char).toBe('\0');
    });
  });

  describe('newLine', () => {
    test('줄 번호를 증가시키고 컬럼을 1로 리셋한다', () => {
      // Given
      const state = createInitialState('hello\nworld');
      state.line = 1;
      state.column = 10;

      // When
      newLine(state);

      // Then
      expect(state.line).toBe(2);
      expect(state.column).toBe(1);
    });
  });

  describe('peek', () => {
    test('현재 문자를 반환한다', () => {
      // Given
      const state = createInitialState('hello');
      state.current = 0;

      // When
      const char = peek(state);

      // Then
      expect(char).toBe('h');
      expect(state.current).toBe(0); // 위치는 변경되지 않음
    });

    test('끝에 도달하면 널 문자를 반환한다', () => {
      // Given
      const state = createInitialState('hi');
      state.current = 2;

      // When
      const char = peek(state);

      // Then
      expect(char).toBe('\0');
    });
  });

  describe('peekNext', () => {
    test('다음 문자를 반환한다', () => {
      // Given
      const state = createInitialState('hello');
      state.current = 0;

      // When
      const char = peekNext(state);

      // Then
      expect(char).toBe('e');
      expect(state.current).toBe(0); // 위치는 변경되지 않음
    });

    test('다음 문자가 없으면 널 문자를 반환한다', () => {
      // Given
      const state = createInitialState('hi');
      state.current = 1;

      // When
      const char = peekNext(state);

      // Then
      expect(char).toBe('\0');
    });

    test('끝에 도달하면 널 문자를 반환한다', () => {
      // Given
      const state = createInitialState('hi');
      state.current = 2;

      // When
      const char = peekNext(state);

      // Then
      expect(char).toBe('\0');
    });
  });

  describe('match', () => {
    test('기대한 문자와 일치하면 소비하고 true를 반환한다', () => {
      // Given
      const state = createInitialState('hello');
      state.current = 0;

      // When
      const result = match(state, 'h');

      // Then
      expect(result).toBe(true);
      expect(state.current).toBe(1);
      expect(state.column).toBe(2);
    });

    test('기대한 문자와 일치하지 않으면 false를 반환한다', () => {
      // Given
      const state = createInitialState('hello');
      state.current = 0;

      // When
      const result = match(state, 'x');

      // Then
      expect(result).toBe(false);
      expect(state.current).toBe(0); // 위치는 변경되지 않음
    });

    test('끝에 도달하면 false를 반환한다', () => {
      // Given
      const state = createInitialState('hi');
      state.current = 2;

      // When
      const result = match(state, 'x');

      // Then
      expect(result).toBe(false);
    });
  });

  describe('addToken', () => {
    test('토큰을 상태에 추가한다', () => {
      // Given
      const state = createInitialState('plant');
      state.start = 0;
      state.current = 5;

      // When
      addToken(state, 'KEYWORD', undefined, 'plant');

      // Then
      expect(state.tokens).toHaveLength(1);
      expect(state.tokens[0]).toMatchObject({
        type: 'KEYWORD',
        lexeme: 'plant',
        keyword: 'plant',
      });
    });

    test('리터럴 값이 있는 토큰을 추가한다', () => {
      // Given
      const state = createInitialState('123');
      state.start = 0;
      state.current = 3;

      // When
      addToken(state, 'NUMBER', 123);

      // Then
      expect(state.tokens[0]).toMatchObject({
        type: 'NUMBER',
        lexeme: '123',
        literal: 123,
      });
    });

    test('토큰의 위치 정보가 올바르게 설정된다', () => {
      // Given
      const state = createInitialState('hello');
      state.start = 0;
      state.current = 5;
      state.line = 2;
      state.column = 6;

      // When
      addToken(state, 'IDENTIFIER');

      // Then
      expect(state.tokens[0].position).toEqual({
        line: 2,
        column: 1, // column - (current - start) = 6 - (5 - 0) = 1
      });
    });
  });

  describe('currentLexeme', () => {
    test('현재 토큰의 lexeme을 반환한다', () => {
      // Given
      const state = createInitialState('hello world');
      state.start = 0;
      state.current = 5;

      // When
      const lexeme = currentLexeme(state);

      // Then
      expect(lexeme).toBe('hello');
    });

    test('빈 토큰의 경우 빈 문자열을 반환한다', () => {
      // Given
      const state = createInitialState('hello');
      state.start = 0;
      state.current = 0;

      // When
      const lexeme = currentLexeme(state);

      // Then
      expect(lexeme).toBe('');
    });
  });

  describe('sliceSource', () => {
    test('소스 문자열의 특정 구간을 잘라 반환한다', () => {
      // Given
      const state = createInitialState('hello world');

      // When
      const sliced = sliceSource(state, 0, 5);

      // Then
      expect(sliced).toBe('hello');
    });

    test('빈 구간의 경우 빈 문자열을 반환한다', () => {
      // Given
      const state = createInitialState('hello');

      // When
      const sliced = sliceSource(state, 2, 2);

      // Then
      expect(sliced).toBe('');
    });
  });
});
