let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "You learn through trials.", category: "Motivation" },
  { text: "Even a follower is as important as the leader.", category: "Inspiration" },
  { text: "Dreamland is as important as working hard.", category: "Vision" },
  { text: "Build with vision not hopes", category: "Clarity" },
  { text: "Small steps everyday", category: "Vision" },
  { text: "Goals are a motivation, not a seal on your future", category: "Motivation" },
  { text: "Everyone is smart in their world, depends what world we need fixing at the time", category: "Clarity" },
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const quoteTextElement = document.getElementById("quoteText");
  const quoteCategoryElement = document.getElementById("quoteCategory");

  if (quoteTextElement && quoteCategoryElement) {
    quoteTextElement.textContent = randomQuote.text;
    quoteCategoryElement.textContent = `- ${randomQuote.category}`;
  } else {
    console.error("Quote text or category element not found!");
  }
}

function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteButton">Add Quote</button>
  `;

  const existingForm = document.querySelector('#quote-form-container');
  if (existingForm) {
      existingForm.innerHTML = '';
      existingForm.appendChild(formContainer);
  } else {
      console.error("Form container element not found!");
      document.body.appendChild(formContainer); // Fallback (not ideal)
  }

  const addQuoteButton = document.getElementById("addQuoteButton");
  if (addQuoteButton) {
    addQuoteButton.addEventListener("click", addQuote);
  } else {
      console.error("Add Quote button not found!");
  }
}

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText !== "" && newQuoteCategory !== "") {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    showRandomQuote(); // Refresh the displayed quote

    console.log("Quote added:", newQuote);
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Event listeners after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  showRandomQuote(); // Show initial quote

  const showQuoteButton = document.getElementById("showQuoteButton");
  if (showQuoteButton) {
      showQuoteButton.addEventListener("click", showRandomQuote);
  } else {
      console.error("Show Quote button not found!");
  }

  const addNewQuoteButton = document.getElementById("addNewQuoteButton");
  if (addNewQuoteButton) {
      addNewQuoteButton.addEventListener("click", createAddQuoteForm);
  } else {
      console.error("Add New Quote button not found!");
  }
});