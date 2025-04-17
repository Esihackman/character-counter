// Selecting DOM Elements 
const themeBtn = document.getElementById("theme-toggle");
const textarea = document.querySelector(".text-area");
const charCountEl = document.querySelectorAll(".stat-value")[0];
const wordCountEl = document.querySelectorAll(".stat-value")[1];
const sentenceCountEl = document.querySelectorAll(".stat-value")[2];
const readingTimeEl = document.querySelector(".reading-time");
const noSpacesCheckbox = document.querySelectorAll("input[type='checkbox']")[0];
const limitCheckbox = document.querySelectorAll("input[type='checkbox']")[1];
const emptyMessage = document.querySelector(".empty-message");
const limitMsg = document.querySelector(".limit-message");
const limitText = document.querySelector(".limit-text");

// Theme Toggle 
let darkMode = false;
themeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark-theme");
  darkMode = !darkMode;

  themeBtn.src = darkMode ? "./assets/images/icon-sun.svg" : "./assets/images/icon-moon.svg";
  themeBtn.alt = darkMode ? "sun-icon" : "moon-icon";

  const logo = document.querySelector(".logo");
  logo.src = darkMode ? "./assets/images/logo-dark-theme.svg" : "./assets/images/logo-light-theme.svg";
});
let limitValue = null;

// Add Limit 
limitCheckbox.addEventListener("change", function () {
  let input = document.getElementById("limit-input");

  if (!input) {
    input = document.createElement("input");
    input.type = "number";
    input.id = "limit-input";
    input.style.width = "31px";
    input.style.height = "21px";
    input.style.marginLeft = "8px";
    limitCheckbox.parentNode.appendChild(input);

    input.addEventListener("input", function () {
      limitValue = parseInt(input.value) || null;
      hideLimitWarning();
      updateStats();
    });
  }

  input.style.display = limitCheckbox.checked ? "inline-block" : "none";

  if (!limitCheckbox.checked) {
    limitValue = null;
    hideLimitWarning();
  }
});

//Input Listener
textarea.addEventListener("input", function () {
  let text = textarea.value;

  emptyMessage.style.display = text.trim() === "" ? "block" : "none";

  if (limitCheckbox.checked && limitValue) {
    if (text.length >= limitValue) {
      textarea.value = text.slice(0, limitValue);
      showLimitWarning();
    } else {
      hideLimitWarning();
    }
  }
updateStats();
});

noSpacesCheckbox.addEventListener("change", updateStats);

// Show / Hide Limit Warning 
function hideLimitWarning() {
  textarea.classList.remove("container-warning");
  charCountEl.parentElement.classList.remove("warning");

  if (limitMsg) {
    limitMsg.style.display = "none";

    // Optional: clear the message
    if (limitText) {
      limitText.textContent = "";
    }
  }
}

function showLimitWarning() {
  textarea.classList.add("container-warning");
  charCountEl.parentElement.classList.add("warning");

  if (limitMsg && limitText) {
    limitText.textContent = `Limit reached! Your text exceeds ${limitValue} characters.`;
    limitMsg.style.display = "flex";
  }
}

// Update Stats
function updateStats() {
  let text = textarea.value;
  let chars = noSpacesCheckbox.checked ? text.replace(/\s/g, "") : text;
let charCount = chars.length;
  let wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  let sentenceCount = text.split(/[.!?]+/).filter(s => s.trim()).length;
  let readingTime = wordCount > 0 ? Math.ceil(wordCount / 200) : 0;

 charCountEl.textContent = String(charCount).padStart(2, '0');
  wordCountEl.textContent = String(wordCount).padStart(2, '0');
  sentenceCountEl.textContent = String(sentenceCount).padStart(2, '0');
  readingTimeEl.textContent = `Approx. reading time: ${readingTime} minute${readingTime !== 1 ? "s" : ""}`;

  if (limitCheckbox.checked && limitValue && charCount >= limitValue) {
    showLimitWarning();
  } else {
    hideLimitWarning();
  }

  updateLetters(text);
}
//  Letter Density 
function updateLetters(text) {
  const container = document.querySelector(".density");
  const seeMore = document.querySelector(".see-more");
  const counts = {};
  let total = 0;

  if (text.trim() !== "") {
    for (let c of text.toUpperCase()) {
      if (/[A-Z]/.test(c)) {
        counts[c] = (counts[c] || 0) + 1;
        total++;
      }
    }

    let sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    let allLetters = sorted.concat("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter(l => !counts[l]));

    document.querySelectorAll(".letter-row").forEach(row => row.remove());

    allLetters.forEach(letter => {
      let count = counts[letter] || 0;
      let percent = total ? ((count / total) * 100).toFixed(1) : 0;

      let row = document.createElement("div");
      row.className = "letter-row";
      row.dataset.letter = letter;
      row.style.display = showMore ? "flex" : "none";

      row.innerHTML = `
        <span class="letter-label">${letter}</span>
        <div class="bar-container"><div class="bar" style="width: ${percent}%"></div></div>
        <span class="percentage">${count} (${percent}%)</span>
      `;

      if (count > 0) row.classList.add("highlighted");
      container.insertBefore(row, seeMore);
    });

    if (!showMore) showTopLetters(5);
  } else {
    document.querySelectorAll(".letter-row").forEach(row => {
      row.style.display = "none";
    });
  }
}

function setupLetters() {
  const container = document.querySelector(".density");
  const seeMore = document.querySelector(".see-more");

  for (let letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
    let row = document.createElement("div");
    row.className = "letter-row";
    row.dataset.letter = letter;
    row.style.display = "none";

    row.innerHTML = `
      <span class="letter-label">${letter}</span>
      <div class="bar-container"><div class="bar"></div></div>
      <span class="percentage">0 (0%)</span>
    `;

    container.insertBefore(row, seeMore);
  }
}

function showTopLetters(n) {
  document.querySelectorAll(".letter-row").forEach((row, i) => {
    row.style.display = i < n ? "flex" : "none";
  });
}

function showAllLetters() {
  document.querySelectorAll(".letter-row").forEach(row => {
    row.style.display = "flex";
  });
}

let showMore = false;
document.querySelector(".see-more").addEventListener("click", function () {
  showMore = !showMore;

  // Update text
  const textEl = this.querySelector(".see-text");
  textEl.textContent = showMore ? "See less" : "See more";

  // Toggle arrow direction using class
  this.querySelector(".arrow-icon").classList.toggle("rotate-up");

  // Your letter toggling functions
  showMore ? showAllLetters() : showTopLetters(5);
});


// Start
setupLetters();
updateStats();
