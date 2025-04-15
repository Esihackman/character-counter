// Theme toggle
const themeToggle = document.getElementById("theme-toggle");
let isDark = false;

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  isDark = !isDark;

  // Toggle icons
  themeToggle.src = isDark
    ? "./assets/images/icon-sun.svg"
    : "./assets/images/icon-moon.svg";
  themeToggle.alt = isDark ? "sun-icon" : "moon-icon";

  // Toggle logo
  const logo = document.querySelector(".logo");
  logo.src = isDark
    ? "./assets/images/logo-dark-theme.svg"
    : "./assets/images/logo-light-theme.svg";
});

const textarea = document.querySelector('.text-area');
const charStat = document.querySelectorAll('.stat-value')[0];
const wordStat = document.querySelectorAll('.stat-value')[1];
const sentenceStat = document.querySelectorAll('.stat-value')[2];
const readingTimeEl = document.querySelector('.reading-time');
const excludeSpacesCheckbox = document.querySelectorAll('input[type="checkbox"]')[0];
const setLimitCheckbox = document.querySelectorAll('input[type="checkbox"]')[1];
const CHAR_LIMIT = 280;

textarea.addEventListener('input', updateStats);

function updateStats() {
  let text = textarea.value;

  // Exclude spaces if checkbox is checked
  let charCount = excludeSpacesCheckbox.checked ? text.replace(/\s/g, '').length : text.length;

  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  const sentenceCount = sentences.length;

  // Update UI stats
  charStat.textContent = charCount;
  wordStat.textContent = wordCount;
  sentenceStat.textContent = sentenceCount;

  // Estimated reading time: avg 200 words per min
  const readingTime = wordCount > 0 ? `${Math.ceil(wordCount / 200)} min` : '<1 minute';
  readingTimeEl.textContent = `Approx. reading time: ${readingTime}`;

  // Character limit warning
  if (setLimitCheckbox.checked && charCount > CHAR_LIMIT) {
    textarea.style.borderColor = 'red';
    charStat.parentElement.classList.add('warning');

    // Only show one toast at a time
    if (!document.querySelector('.toast')) {
      showToast(`Character limit of ${CHAR_LIMIT} exceeded!`);
    }
  } else {
    textarea.style.borderColor = '';
    charStat.parentElement.classList.remove('warning');
  }

  // Update letter density
  updateLetterDensity(text);
}

// Letter frequency analysis
function updateLetterDensity(text) {
  const letterRows = document.querySelectorAll('.letter-row');
  const letterCounts = {};
  let totalLetters = 0;

  for (let char of text.toUpperCase()) {
    if (char >= 'A' && char <= 'Z') {
      letterCounts[char] = (letterCounts[char] || 0) + 1;
      totalLetters++;
    }
  }

  letterRows.forEach(row => {
    const letter = row.dataset.letter;
    const count = letterCounts[letter] || 0;
    const percent = totalLetters > 0 ? ((count / totalLetters) * 100).toFixed(2) : 0;

    const bar = row.querySelector('.bar');
    const percentSpan = row.querySelector('.percentage');

    bar.style.width = `${percent}%`;
    percentSpan.textContent = `${count} (${percent}%)`;
  });
}

// Toast alert
function showToast(message) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;

  const container = document.getElementById("toast-container");
  container.appendChild(toast);

  // Remove toast after 4 seconds
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

