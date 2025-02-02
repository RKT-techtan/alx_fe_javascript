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

  const quoteTextElement = document.getElementById("quoteText"); // Make sure you have an element with this ID in your HTML
  const quoteCategoryElement = document.getElementById("quoteCategory"); // And this one for the category

  if (quoteTextElement && quoteCategoryElement) {  // Check if elements exist
    quoteTextElement.textContent = randomQuote.text;
    quoteCategoryElement.textContent = `- ${randomQuote.category}`; // Added a hyphen for better formatting
  } else {
    console.error("Quote text or category element not found!");
  }
}



function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;

  const existingForm = document.querySelector('#quote-form-container'); // ID to hold the form
  if(existingForm) {
      existingForm.innerHTML = ''; // Clear any existing form
      existingForm.appendChild(formContainer);
  } else {
      console.error("Form container element not found!");
      document.body.appendChild(formContainer); // Fallback: add to body if container doesn't exist
  }

}

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText.trim() !== "" && newQuoteCategory.trim() !== "") {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);

    // Clear the form inputs after adding
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    // Optionally, you could refresh the displayed quote after adding
    showRandomQuote();

    console.log("Quote added:", newQuote); // For debugging
  } else {
    alert("Please enter both a quote and a category.");
  }
}


// Example usage (call this when the page loads or a button is clicked)
// For example in your HTML: <body onload="showRandomQuote()">
// Or if you have a button: <button onclick="showRandomQuote()">Show Quote</button>

// To show the "Add Quote" form:
// <button onclick="createAddQuoteForm()">Add New Quote</button>