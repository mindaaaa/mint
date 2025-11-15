import { KEYWORDS, type KeywordType } from '@core/lexer/tokens.js';

describe('tokens', () => {
  describe('KEYWORDS', () => {
    test('모든 Mint 키워드가 KEYWORDS 객체에 올바르게 정의되어 있다', () => {
      // Given
      const expectedKeywords: KeywordType[] = [
        'plant',
        'breeze',
        'bloom',
        'petal',
        'gift',
        'sparkle',
        'softly',
      ];

      // When & Then
      expectedKeywords.forEach((keyword) => {
        expect(KEYWORDS[keyword]).toBe(keyword);
      });
    });

    test('KEYWORDS 객체의 모든 키와 값이 일치한다', () => {
      // Given & When
      const entries = Object.entries(KEYWORDS);

      // Then
      entries.forEach(([key, value]) => {
        expect(key).toBe(value);
        expect(typeof key).toBe('string');
        expect(typeof value).toBe('string');
      });
    });

    test('KEYWORDS에 정의되지 않은 문자열은 undefined를 반환한다', () => {
      // Given
      const unknownKeywords = ['unknown', 'notAKeyword', 'random'];

      // When & Then
      unknownKeywords.forEach((keyword) => {
        expect(KEYWORDS[keyword]).toBeUndefined();
      });
    });

    test('KEYWORDS는 정확히 7개의 키워드를 포함한다', () => {
      // Given & When
      const keywordCount = Object.keys(KEYWORDS).length;

      // Then
      expect(keywordCount).toBe(7);
    });

    test('KEYWORDS의 모든 값이 KeywordType에 해당한다', () => {
      // Given
      const validKeywordTypes: KeywordType[] = [
        'plant',
        'breeze',
        'bloom',
        'petal',
        'gift',
        'sparkle',
        'softly',
      ];

      // When
      const keywordValues = Object.values(KEYWORDS);

      // Then
      keywordValues.forEach((value) => {
        expect(validKeywordTypes).toContain(value);
      });
    });

    test('KEYWORDS는 Record<string, KeywordType> 타입을 만족한다', () => {
      // Given & When
      const entries = Object.entries(KEYWORDS);

      // Then
      entries.forEach(([key, value]) => {
        expect(typeof key).toBe('string');
        expect([
          'plant',
          'breeze',
          'bloom',
          'petal',
          'gift',
          'sparkle',
          'softly',
        ]).toContain(value);
      });
    });
  });
});
