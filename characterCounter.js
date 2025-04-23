
function countCharacters(text, excludeSpaces = false) {
  if (excludeSpaces) {
    return text.replace(/\s/g, '').length;
  }
  return text.length;
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function countSentences(text) {
  return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
}

module.exports = {
  countCharacters,
  countWords,
  countSentences
};
