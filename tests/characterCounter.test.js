const { countCharacters, countWords, countSentences } = require('../characterCounter');
describe('Character Counter Functions', () => {
  test('should count characters including spaces', () => {
    const input = 'Hello Mabel';
    expect(countCharacters(input)).toBe(11);
  });

  test('should count words', () => {
    const input = 'Hello world from Mabel';
    expect(countWords(input)).toBe(4);
  });

  test('should count sentences', () => {
    const input = 'This is a sentence. This is another!';
    expect(countSentences(input)).toBe(2);
  });


  test('should return 0 for empty string', () => {
    expect(countCharacters('')).toBe(0);
    expect(countWords('')).toBe(0);
    expect(countSentences('')).toBe(0);
  });

  
  test('should handle multiple spaces between words', () => {
    const input = 'Mabel     is    my      Name';
    expect(countWords(input)).toBe(4);
  });


  test('should include special characters in character count', () => {
    const input = 'Hello!';
    expect(countCharacters(input)).toBe(6); 
  });
});
