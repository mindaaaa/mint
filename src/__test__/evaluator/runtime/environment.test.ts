import { Environment } from '@core/evaluator/runtime/environment.js';
import { EvaluatorError } from '@core/evaluator/errors/errors.js';

describe('Environment', () => {
  describe('declare', () => {
    test('변수를 선언하고 값을 저장한다', () => {
      // Given
      const env = new Environment();
      const value = 123;

      // When
      const result = env.declare('x', value);

      // Then
      expect(result).toBe(value);
      expect(env.get('x')).toBe(value);
    });

    test('여러 변수를 선언할 수 있다', () => {
      // Given
      const env = new Environment();

      // When
      env.declare('x', 1);
      env.declare('y', 2);
      env.declare('z', 3);

      // Then
      expect(env.get('x')).toBe(1);
      expect(env.get('y')).toBe(2);
      expect(env.get('z')).toBe(3);
    });

    test('상위 스코프에 변수를 선언할 수 있다', () => {
      // Given
      const parent = new Environment();
      const child = parent.createChild();
      parent.declare('x', 1);

      // When
      parent.declare('x', 2); // 상위 스코프의 변수 재선언

      // Then
      expect(parent.get('x')).toBe(2);
    });
  });

  describe('assign', () => {
    test('기존 변수에 값을 대입한다', () => {
      // Given
      const env = new Environment();
      env.declare('x', 1);

      // When
      const result = env.assign('x', 2);

      // Then
      expect(result).toBe(2);
      expect(env.get('x')).toBe(2);
    });

    test('상위 스코프의 변수에 값을 대입한다', () => {
      // Given
      const parent = new Environment();
      const child = parent.createChild();
      parent.declare('x', 1);

      // When
      parent.assign('x', 2);

      // Then
      expect(parent.get('x')).toBe(2);
    });

    test('존재하지 않는 변수에 대입하면 EvaluatorError를 발생시킨다', () => {
      // Given
      const env = new Environment();

      // When
      const when = () => env.assign('x', 1);

      // Then
      expect(when).toThrow(EvaluatorError);
      try {
        env.assign('x', 1);
      } catch (error) {
        expect(error).toBeInstanceOf(EvaluatorError);
        if (error instanceof EvaluatorError) {
          expect(error.code).toBe('EVALUATOR_INVALID_ASSIGNMENT_TARGET');
        }
      }
    });
  });

  describe('get', () => {
    test('변수 값을 조회한다', () => {
      // Given
      const env = new Environment();
      env.declare('x', 123);

      // When
      const value = env.get('x');

      // Then
      expect(value).toBe(123);
    });

    test('상위 스코프의 변수를 조회한다', () => {
      // Given
      const parent = new Environment();
      const child = parent.createChild();
      parent.declare('x', 123);

      // When
      const value = child.get('x');

      // Then
      expect(value).toBe(123);
    });

    test('존재하지 않는 변수를 조회하면 EvaluatorError를 발생시킨다', () => {
      // Given
      const env = new Environment();

      // When
      const when = () => env.get('x');

      // Then
      expect(when).toThrow(EvaluatorError);
      try {
        env.get('x');
      } catch (error) {
        expect(error).toBeInstanceOf(EvaluatorError);
        if (error instanceof EvaluatorError) {
          expect(error.code).toBe('EVALUATOR_UNDEFINED_IDENTIFIER');
        }
      }
    });

    test('다양한 타입의 값을 저장하고 조회할 수 있다', () => {
      // Given
      const env = new Environment();

      // When
      env.declare('num', 123);
      env.declare('str', 'hello');
      env.declare('bool', true);
      env.declare('null', null);

      // Then
      expect(env.get('num')).toBe(123);
      expect(env.get('str')).toBe('hello');
      expect(env.get('bool')).toBe(true);
      expect(env.get('null')).toBe(null);
    });
  });

  describe('createChild', () => {
    test('자식 환경을 생성한다', () => {
      // Given
      const parent = new Environment();

      // When
      const child = parent.createChild();

      // Then
      expect(child).toBeInstanceOf(Environment);
    });

    test('자식 환경에서 상위 스코프의 변수를 조회할 수 있다', () => {
      // Given
      const parent = new Environment();
      const child = parent.createChild();
      parent.declare('x', 123);

      // When
      const value = child.get('x');

      // Then
      expect(value).toBe(123);
    });

    test('자식 환경에서 선언한 변수는 상위 스코프에서 조회할 수 없다', () => {
      // Given
      const parent = new Environment();
      const child = parent.createChild();
      child.declare('x', 123);

      // When
      const when = () => parent.get('x');

      // Then
      expect(when).toThrow(EvaluatorError);
    });

    test('자식 환경에서 선언한 변수는 자식 환경에서만 조회할 수 있다', () => {
      // Given
      const parent = new Environment();
      const child = parent.createChild();
      child.declare('x', 123);

      // When
      const value = child.get('x');

      // Then
      expect(value).toBe(123);
    });

    test('여러 단계의 스코프 체인을 지원한다', () => {
      // Given
      const global = new Environment();
      const parent = global.createChild();
      const child = parent.createChild();
      global.declare('x', 1);
      parent.declare('y', 2);
      child.declare('z', 3);

      // When & Then
      expect(child.get('x')).toBe(1);
      expect(child.get('y')).toBe(2);
      expect(child.get('z')).toBe(3);
    });
  });
});
