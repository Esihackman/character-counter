// Selecting DOM Elements 
const themeBtn = document.getElementById("theme-toggle");
const textarea = document.querySelector(".text-area");
const textareaContainer = textarea.closest(".container") || textarea.parentElement; // Get the container
const charCountEl = document.querySelector(".stat.purple .stat-value");
const wordCountEl = document.querySelector(".stat.orange .stat-value");
const sentenceCountEl = document.querySelector(".stat.red .stat-value");
const readingTimeEl = document.querySelector(".reading-time");
const noSpacesCheckbox = document.getElementById("exclude-spaces");
const limitCheckbox = document.getElementById("set-character-limit");
const emptyMessage = document.querySelector(".empty-message");
const densityContainer = document.querySelector(".density");
const seeMoreBtn = document.querySelector(".see-more");

// Check if the limit message elements exist, if not create them
let limitMsg = document.querySelector(".limit-message");
let limitText = document.querySelector(".limit-text");

if (!limitMsg) {
  // Create the limit message element if it doesn't exist
  limitMsg = document.createElement("div");
  limitMsg.className = "limit-message";
  limitMsg.style.display = "none";
  
  limitText = document.createElement("span");
  limitText.className = "limit-text";
  
  limitMsg.appendChild(limitText);
  
  // Insert after textarea container
  textareaContainer.parentNode.insertBefore(limitMsg, textareaContainer.nextSibling);
  
  console.log("Created limit message elements");
}

let showMore = false;
let limitValue = null;
let darkMode = false;

// Theme Toggle 
themeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark-theme");
  darkMode = !darkMode;

  themeBtn.src = darkMode ? "./assets/images/icon-sun.svg" : "./assets/images/icon-moon.svg";
  themeBtn.alt = darkMode ? "sun-icon" : "moon-icon";

  const logo = document.querySelector(".logo");
  logo.src = darkMode ? "./assets/images/logo-dark-theme.svg" : "./assets/images/logo-light-theme.svg";
  
  // Apply the dark mode class to the limit message too (if it exists)
  if (limitMsg) {
    limitMsg.classList.toggle("dark-theme");
  }
});

// Character Limit Checkbox
limitCheckbox.addEventListener("change", function () {
  let input = document.getElementById("limit-input");

  if (!input) {
    input = document.createElement("input");
    input.type = "number";
    input.id = "limit-input";
    input.className = "limit-input";
    limitCheckbox.parentNode.appendChild(input);

    input.addEventListener("input", function () {
      limitValue = parseInt(input.value) || null;
      updateStats();
    });
  }

  input.style.display = limitCheckbox.checked ? "inline-block" : "none";

  if (!limitCheckbox.checked) {
    limitValue = null;
    hideLimitWarning();
  } else {
    // When checkbox is checked and there's already a value
    if (input.value) {
      limitValue = parseInt(input.value);
      updateStats(); // Check limit immediately
    }
  }
});

// Input Listener
textarea.addEventListener("input", function () {
  updateStats();
});

noSpacesCheckbox.addEventListener("change", updateStats);

// Show / Hide Limit Warning 
function showLimitWarning() {
  textareaContainer.classList.add("container-warning"); // Add warning class to container
  charCountEl.parentElement.classList.add("warning");
  
  limitText.textContent = `Limit reached! Your text exceeds ${limitValue} characters.`;
  limitMsg.style.display = "block";
  
  // Apply dark theme class if we're in dark mode
  if (darkMode) {
    limitMsg.classList.add("dark-theme");
  } else {
    limitMsg.classList.remove("dark-theme");
  }
  
  console.log("Showing limit warning, dark mode:", darkMode);
}

function hideLimitWarning() {
  textareaContainer.classList.remove("container-warning"); // Remove warning class from container
  charCountEl.parentElement.classList.remove("warning");
  
  limitMsg.style.display = "none";
  limitText.textContent = "";
  
  console.log("Hiding limit warning");
}

// Update Statistics
function updateStats() {
  let text = textarea.value;
  emptyMessage.style.display = text.trim() === "" ? "block" : "none";
  
  let chars = noSpacesCheckbox.checked ? text.replace(/\s/g, "") : text;
  let charCount = chars.length;
  let wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  let sentenceCount = text.split(/[.!?]+/).filter(s => s.trim()).length;
  let readingTime = wordCount > 0 ? Math.ceil(wordCount / 200) : 0;

  charCountEl.textContent = String(charCount).padStart(2, '0');
  wordCountEl.textContent = String(wordCount).padStart(2, '0');
  sentenceCountEl.textContent = String(sentenceCount).padStart(2, '0');
  readingTimeEl.textContent = `Approx. reading time: ${readingTime} minute${readingTime !== 1 ? "s" : ""}`;

  console.log("Checking limit: ", limitCheckbox.checked, limitValue, charCount);
  
  // Check limit after updating character count
  if (limitCheckbox.checked && limitValue && charCount > limitValue) {
    console.log("Limit exceeded!");
    showLimitWarning();
    
    // Trim text if it exceeds the limit
    if (text.length > limitValue) {
      textarea.value = text.slice(0, limitValue);
      // Recalculate after trimming
      chars = noSpacesCheckbox.checked ? textarea.value.replace(/\s/g, "") : textarea.value;
      charCount = chars.length;
      charCountEl.textContent = String(charCount).padStart(2, '0');
      
      // Don't call updateStats again to avoid recursion
      updateLetters(textarea.value);
      return; // Return to avoid infinite recursion
    }
  } else {
    hideLimitWarning();
  }

  updateLetters(text);
}

// Letter Density Calculation
function updateLetters(text) {
  const counts = {};
  let total = 0;

  if (text.trim() !== "") {
    for (let c of text.toUpperCase()) {
      if (/[A-Z]/.test(c)) {
        counts[c] = (counts[c] || 0) + 1;
        total++;
      }
    }

    const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    const allLetters = sorted.concat("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter(l => !counts[l]));

    document.querySelectorAll(".letter-row").forEach(row => row.remove());

    allLetters.forEach(letter => {
      const count = counts[letter] || 0;
      const percent = total ? ((count / total) * 100).toFixed(1) : 0;
      const row = createLetterRow(letter, count, percent);
      densityContainer.insertBefore(row, seeMoreBtn);
    });

    if (!showMore) showTopLetters(5);
  } else {
    document.querySelectorAll(".letter-row").forEach(row => row.style.display = "none");
  }
}

// Create a letter row
function createLetterRow(letter, count, percent) {
  const row = document.createElement("div");
  row.className = "letter-row";
  row.dataset.letter = letter;
  row.style.display = showMore ? "flex" : "none";
  row.innerHTML = `
    <span class="letter-label">${letter}</span>
    <div class="bar-container">
      <div class="bar" style="width: ${percent}%"></div>
    </div>
    <span class="percentage">${count} (${percent}%)</span>
  `;
  if (count > 0) row.classList.add("highlighted");
  return row;
}

// Toggle Top / All Letters
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

// Setup initial hidden rows
function setupLetters() {
  for (let letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
    const row = createLetterRow(letter, 0, 0);
    row.style.display = "none";
    densityContainer.insertBefore(row, seeMoreBtn);
  }
}

// See More / See Less
seeMoreBtn.addEventListener("click", function () {
  showMore = !showMore;

  const textEl = this.querySelector(".see-text");
  textEl.textContent = showMore ? "See less" : "See more";
  this.querySelector(".arrow-icon").classList.toggle("rotate-up");

  showMore ? showAllLetters() : showTopLetters(5);
});

// Initial setup
setupLetters();
updateStats();

// Check dark mode state initially
darkMode = document.body.classList.contains("dark-theme");
if (darkMode && limitMsg) {
  limitMsg.classList.add("dark-theme");
}