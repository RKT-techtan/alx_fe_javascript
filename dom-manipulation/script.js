let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "You learn through trials.", category: "Motivation" },
  { text: "Even a follower is as important as the leader.", category: "Inspiration" },
  { text: "Dreamland is as important as working hard.", category: "Vision" },
  { text: "Build with vision not hopes", category: "Clarity" },
  { text: "Small steps everyday", category: "Vision" },
  { text: "Goals are a motivation, not a seal on your future", category: "Motivation" },
  { text: "Everyone is smart in their world, depends what world we need fixing at the time", category: "Clarity" },
];

// ... (The code you provided for initializing the quotes array) ...

function showRandomQuote() {
  const randomIndex = getRandomIndex(quotes.length);  // Get a random index
  const randomQuote = quotes[randomIndex];           // Get the quote at that index

  const quoteTextElement = document.getElementById("quote-text"); // Get the HTML element to display the quote (you'd need an element with this ID in your HTML)
  const quoteCategoryElement = document.getElementById("quote-category"); // Element to display the category

  if (quoteTextElement && quoteCategoryElement) { //Make sure the elements exist
    quoteTextElement.innerHTML = randomQuote.text;           // Set the quote text
    quoteCategoryElement.innerHTML = `- ${randomQuote.category}`; //Set the category
  } else {
    console.error("Quote text or category element not found in HTML");
  }
}

function getRandomIndex(max) {
  return Math.floor(Math.random() * max); // Generates a random integer between 0 (inclusive) and max (exclusive)
}

// Call showRandomQuote() when the page loads or when a button is clicked, etc.
window.addEventListener('DOMContentLoaded', showRandomQuote); // Show a quote when the page loads

// Example of how to call it when a button is clicked:
const newQuoteButton = document.getElementById("new-quote-button"); // Assuming you have a button with this ID
if (newQuoteButton) {
  newQuoteButton.addEventListener("click", showRandomQuote);
}