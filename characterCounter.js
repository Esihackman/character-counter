function countCharacters(text) {
  return text.length;
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function countSentences(text) {
  return (text.match(/[\.\!\?]+/g) || []).length;
}

module.exports = {
  countCharacters,
  countWords,
  countSentences,
};
