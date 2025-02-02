// This array holds our quotes. It's either loaded from local storage or,
// if nothing is there, it starts with these default quotes.
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "You learn through trials.", category: "Motivation" },
  { text: "Even a follower is as important as the leader.", category: "Inspiration" },
  { text: "Dreamland is as important as working hard.", category: "Vision" },
  { text: "Build with vision not hopes", category: "Clarity" },
  { text: "Small steps everyday", category: "Vision" },
  { text: "Goals are a motivation, not a seal on your future", category: "Motivation" },
  { text: "Everyone is smart in their world, depends what world we need fixing at the time", category: "Clarity" },
];

// This function shows a random quote on the page.
function showRandomQuote() {
  // Get a random number to pick a quote. Math.random() gives us a number
  // between 0 and 1. We multiply it by the number of quotes we have
  // and use Math.floor() to round it down to a whole number.
  const randomIndex = Math.floor(Math.random() * quotes.length);

  // Use the random number to get a quote from our array.
  const randomQuote = quotes[randomIndex];

  // Find the HTML elements where we want to display the quote and category.
  // You MUST have elements with these IDs in your HTML for this to work!
  const quoteTextElement = document.getElementById("quote-text");
  const quoteCategoryElement = document.getElementById("quote-category");

  // Check if the quote elements exist before trying to use them.
  if (quoteTextElement && quoteCategoryElement) {
      // Put the quote text into the HTML element.
      quoteTextElement.innerHTML = randomQuote.text;
      quoteCategoryElement.innerHTML = `- ${randomQuote.category}`;
  } else {
      // If the elements aren't found, tell us in the console. This helps with debugging.
      console.error("Quote text or category element not found in HTML");
  }
}

// This function creates the form for adding new quotes.
function createAddQuoteForm() {
  // Make a new form element.
  const form = document.createElement("form");
  form.id = "add-quote-form"; // Give it an ID so we can find it later

  // ... (rest of your form creation code - text input, category input, submit button)

  form.addEventListener("submit", handleAddQuote);

  // Add the form to the page. We're adding it to the <body>.
  document.body.appendChild(form); // Or wherever you want to add it
}

// This function handles adding a new quote.
function handleAddQuote(event) {
  // Stop the form from actually submitting (which would refresh the page).
  event.preventDefault();

  // Get the quote text and category from the input fields.
  const text = document.getElementById("quote-text-input").value;
  const category = document.getElementById("quote-category-input").value;

  // Make sure the user entered something.
  if (text.trim() === "" || category.trim() === "") {
      alert("Please enter both quote text and category.");
      return; // Don't add the quote if the fields are empty.
  }

  // Create a new quote object.
  const newQuote = { text: text, category: category };

  // Add the new quote to our array.
  quotes.push(newQuote);

  // Save the updated quotes array to local storage.
  saveQuotes();

  // Clear the form inputs.
  document.getElementById("quote-text-input").value = "";
  document.getElementById("quote-category-input").value = "";

  // Tell the user the quote was added.
  alert("Quote added successfully!");

  populateCategories(); // Update the category dropdown
  filterQuotes();         // Show a relevant quote
}

// Implement JSON Export
function exportToJson() {
  // ... (your export to JSON code)
}

// Implement JSON Import
function importFromJsonFile(event) {
  // ... (your import from JSON code)
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter"); // Corrected ID

  if (!categorySelect) {
      console.error("Category filter element not found in HTML");
      return; // Exit if the element isn't there
  }

  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))]; // Get unique categories

  // Clear existing options (important to prevent duplicates)
  categorySelect.innerHTML = ""; // Clear all children

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.text = "All Categories"; // More descriptive
  categorySelect.appendChild(allOption);

  uniqueCategories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.text = category;
      categorySelect.appendChild(option);
  });

  const lastSelectedCategory = localStorage.getItem('selectedCategory') || 'all'; // Default to "all"
  categorySelect.value = lastSelectedCategory;

  categorySelect.addEventListener("change", filterQuotes);
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value; // Corrected ID
  localStorage.setItem('selectedCategory', selectedCategory);

  const quoteTextElement = document.getElementById("quote-text");
  const quoteCategoryElement = document.getElementById("quote-category");

  if (!quoteTextElement || !quoteCategoryElement) {
      console.error("Quote elements not found in HTML");
      return;
  }

  if (selectedCategory === "all") {
      showRandomQuote();
  } else {
      const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
      if (filteredQuotes.length > 0) {
          const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
          const randomQuote = filteredQuotes[randomIndex];
          quoteTextElement.innerHTML = randomQuote.text;
          quoteCategoryElement.innerHTML = `- ${randomQuote.category}`;
      } else {
          quoteTextElement.innerHTML = "No quotes in this category yet.";
          quoteCategoryElement.innerHTML = "";
      }
  }
}

// Call these functions when the page loads.
window.addEventListener('DOMContentLoaded', () => {
  showRandomQuote();    // Show a quote when the page loads
  createAddQuoteForm(); // Create the "add quote" form
  populateCategories(); // Call this to populate on load
  filterQuotes();     // Call this to set initial quote based on stored filter or "all"
});