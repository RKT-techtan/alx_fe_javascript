// This is an array called 'quotes'.  It holds a bunch of quote objects.
// Each quote object has two properties: 'text' (the actual quote) and 'category'.
const quotes = [
  { text: "You learn through trials.", category: "Motivation" },
  { text: "Even a follower is as important as the leader.", category: "Inspiration" },
  { text: "Dreamland is as important as working hard.", category: "Vision" },
  { text: "Build with vision not hopes", category: "Clarity" },
  { text: "Small steps everyday", category: "Vision" },
  { text: "Goals are a motivation, not a seal on your future", category: "Motivation" },
  { text: "Everyone is smart in their world, depends what world we need fixing at the time", category: "Clarity" },
];

// This gets the HTML element where we'll display the quote.  It finds the element with the ID "quoteDisplay".
const quoteDisplay = document.getElementById("quoteDisplay");

// This gets the button that will be used to show a new quote. It finds the element with the ID "newQuote".
const newQuoteButton = document.getElementById("newQuote");

// This adds a "click" event listener to the "newQuoteButton".
// When the button is clicked, it will run the 'showRandomQuote' function.
newQuoteButton.addEventListener("click", showRandomQuote);

// This shows a quote right when the page loads.
showRandomQuote();

// This function creates the form to add new quotes.
function createAddQuoteForm() {
  // Creates a new div element. This will hold our form elements.
  const addQuoteSection = document.createElement("div");

  // Sets the HTML inside the div.  This creates the input fields and the button.
  // The backticks (`) allow us to write multi-line strings and embed variables.
  addQuoteSection.innerHTML = `
  <input type="text" id="newQuoteText" placeholder="New quote">
  <input type="text" id="newQuoteCategory" placeholder="Category">
  <button onclick="addNewQuote()">Add Quote</button>  
  `; // The onclick event here will call the addNewQuote function when the button is clicked.

  // Returns the div element containing the form.
  return addQuoteSection;
}

// Calls the createAddQuoteForm function to actually create the form and stores it in the addQuoteForm variable.
const addQuoteForm = createAddQuoteForm();

// Adds the newly created form to the page.  It appends it to the <body> of the HTML.
document.body.appendChild(addQuoteForm);


// This function displays a random quote on the page.
function showRandomQuote() {
  // Generates a random number between 0 and the length of the 'quotes' array.
  // Math.random() gives a number between 0 (inclusive) and 1 (exclusive).
  // We multiply it by the length of the array to get a number within the array's indices.
  // Math.floor() rounds the number down to the nearest whole number.
  const randomIndex = Math.floor(Math.random() * quotes.length);

  // Sets the text content of the 'quoteDisplay' element to the randomly selected quote.
  quoteDisplay.textContent = quotes[randomIndex].text;
}

// This function adds a new quote to the 'quotes' array.
function addNewQuote() {
  // Gets the text entered by the user for the new quote. .trim() removes extra whitespace.
  const quoteText = document.getElementById("newQuoteText").value.trim();

  // Gets the category entered by the user for the new quote.
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  // Checks if both the quote text and category are filled in.
  if (!quoteText || !quoteCategory) {
      // Shows an alert if either field is empty.
      alert("Please fill in both the quote and its category.");
      // Stops the function from running any further.
      return;
  }

  // Adds the new quote object to the 'quotes' array using the push method.
  quotes.push({ text: quoteText, category: quoteCategory });

  // Clears the input fields after the quote is added.
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Shows a new random quote after adding the quote.
  showRandomQuote();
}