describe('Character Counter DOM Interactions', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <textarea class="text-area"></textarea>
      <span class="stat-value char-count"></span>
      <div class="limit-message" style="display:none;">Character limit exceeded</div>
      <input type="checkbox" id="exclude-spaces">
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
});
    //test on word count
test('should count words in the input', () => {
  const textarea = document.querySelector(".text-area");
  textarea.value = "This is a test message.";
  const wordCount = textarea.value.trim().split(/\s+/).length;

  expect(wordCount).toBe(5);
});

//test on sentence count
test('should count sentences based on punctuation', () => {
  const textarea = document.querySelector(".text-area");
  textarea.value = "Hello world. How are you? I am fine!";
  const sentenceCount = (textarea.value.match(/[^\.!\?]+[\.!\?]+/g) || []).length;

  expect(sentenceCount).toBe(3);
});

    //test on empty input
  test('character count should be 00 for empty input', () => {
    const textarea = document.querySelector(".text-area");
    const charCountEl = document.querySelector(".char-count");

    textarea.value = "";
    charCountEl.textContent = textarea.value.length.toString().padStart(2, '0');
    expect(charCountEl.textContent).toBe("00");
  });
    //test on special characters
  test('correctly counts special characters', () => {
    const textarea = document.querySelector(".text-area");
    const charCountEl = document.querySelector(".char-count");

    textarea.value = "!@#";
    const count = textarea.value.length;
    charCountEl.textContent = count.toString().padStart(2, '0');
    expect(charCountEl.textContent).toBe("03");
  });
     
  //test to handle long test without breaking
  test('handles very long text without crashing', () => {
    const textarea = document.querySelector(".text-area");
    const charCountEl = document.querySelector(".char-count");

    const longText = 'A'.repeat(100);
    textarea.value = longText;
    charCountEl.textContent = textarea.value.length.toString().padStart(2, '0');
    expect(charCountEl.textContent).toBe("100"); 
  });

