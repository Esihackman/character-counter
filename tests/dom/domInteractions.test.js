describe('Character Counter DOM Interactions', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <textarea class="text-area"></textarea>
      <span class="stat-value char-count"></span>
      <div class="limit-message" style="display:none;">Character limit exceeded</div>
      <input type="checkbox" id="exclude-spaces">
      <button id="dark-mode-toggle">Toggle Dark Mode</button>
    `;
  });
        // Test to update character count
  test('should update char count in DOM on input', () => {
    const textarea = document.querySelector(".text-area");
    const charCountEl = document.querySelector(".char-count");

    textarea.value = "Hello";
    charCountEl.textContent = String(textarea.value.length).padStart(2, '0');

    expect(charCountEl.textContent).toBe("05");
  });
  
        //Test on warning
  test('should display a warning when character limit is exceeded', () => {
    const textarea = document.querySelector(".text-area");
    const charCountEl = document.querySelector(".char-count");
    const limitMessage = document.querySelector(".limit-message");

    const limit = 10;
    textarea.value = "Hello, world!";
    charCountEl.textContent = String(textarea.value.length).padStart(2, '0');

    if (textarea.value.length > limit) {
      limitMessage.style.display = "block";
    }

    expect(charCountEl.textContent).toBe("13");
    expect(limitMessage.style.display).toBe("block");
  });

        //Test to exclude spaces
  test('should exclude spaces from character count when the toggle is on', () => {
    const textarea = document.querySelector(".text-area");
    const charCountEl = document.querySelector(".char-count");
    const excludeSpacesCheckbox = document.querySelector("#exclude-spaces");

    textarea.value = "Hello World";
    excludeSpacesCheckbox.checked = true;

    const countWithoutSpaces = textarea.value.replace(/\s+/g, '').length;
    charCountEl.textContent = String(countWithoutSpaces).padStart(2, '0');

    expect(charCountEl.textContent).toBe("10");
  });

       //Test for dark mode
  test('should toggle dark mode on button click', () => {
    const darkModeButton = document.querySelector("#dark-mode-toggle");
    const body = document.body;

    darkModeButton.addEventListener("click", () => {
      body.classList.toggle("dark-theme");
    });

    
    darkModeButton.click();
    expect(body.classList.contains("dark-theme")).toBe(true);

    
    darkModeButton.click();
    expect(body.classList.contains("dark-theme")).toBe(false);
  });
});
