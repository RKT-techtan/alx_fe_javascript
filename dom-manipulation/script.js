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

function createAddQuoteForm() {
  const form = document.createElement("form");
  form.id = "add-quote-form";

  const textLabel = document.createElement("label");
  textLabel.textContent = "Quote Text:";
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.id = "quote-text-input";
  textInput.required = true; // Make the quote text required

  const categoryLabel = document.createElement("label");
  categoryLabel.textContent = "Category:";
  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "quote-category-input";
  categoryInput.required = true;

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Add Quote";

  form.appendChild(textLabel);
  form.appendChild(textInput);
  form.appendChild(categoryLabel);
  form.appendChild(categoryInput);
  form.appendChild(submitButton);

  form.addEventListener("submit", handleAddQuote); // Add event listener for form submission

  document.body.appendChild(form); // Add the form to the page (you can choose where to add it)
}

function handleAddQuote(event) {
  event.preventDefault(); // Prevent the default form submission behavior (page refresh)

  const text = document.getElementById("quote-text-input").value;
  const category = document.getElementById("quote-category-input").value;

  if (text.trim() === "" || category.trim() === "") {
    alert("Please enter both quote text and category.");
    return; // Don't add the quote if fields are empty
  }

  const newQuote = { text: text, category: category };
  quotes.push(newQuote); // Add the new quote to the array

  saveQuotesToLocalStorage(); // Save the updated quotes array to local storage

  // Clear the form inputs after successful submission
  document.getElementById("quote-text-input").value = "";
  document.getElementById("quote-category-input").value = "";

  alert("Quote added successfully!"); // Or some other user feedback

  showRandomQuote(); // Optionally, display a new random quote after adding one
}

function saveQuotesToLocalStorage() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Call createAddQuoteForm() to add the form to the page
createAddQuoteForm();