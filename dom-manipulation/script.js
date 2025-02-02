// Our collection of quotes. We try to grab any existing quotes from local storage.
// If there aren't any saved yet, we'll use these defaults.
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "You learn through trials.", category: "Motivation" },
  { text: "Even a follower is as important as the leader.", category: "Inspiration" },
  { text: "Dreamland is as important as working hard.", category: "Vision" },
  { text: "Build with vision not hopes", category: "Clarity" },
  { text: "Small steps everyday", category: "Vision" },
  { text: "Goals are a motivation, not a seal on your future", category: "Motivation" },
  { text: "Everyone is smart in their world, depends what world we need fixing at the time", category: "Clarity" },
];

// Function to save our quotes to local storage. We'll call this whenever we update the quotes.
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Where we'll display the quote. Make sure you have an element with the ID "quoteDisplay" in your HTML.
const quoteDisplay = document.getElementById("quoteDisplay");

// The button that triggers a new quote. You'll need a button with the ID "newQuote" in your HTML.
const newQuoteButton = document.getElementById("newQuote");

// When the "New Quote" button is clicked, we'll show a random quote.
newQuoteButton.addEventListener("click", showRandomQuote);

// Show a quote when the page loads.
showRandomQuote();

// Function to create the form for adding new quotes. This sets up the input fields and the button.
function createAddQuoteForm() {
  const addQuoteSection = document.createElement("div"); // A container for our form elements

  // Using template literals makes the HTML a lot easier to read.
  addQuoteSection.innerHTML = `
      <input type="text" id="newQuoteText" placeholder="New quote">
      <input type="text" id="newQuoteCategory" placeholder="Category">
      <button onclick="addNewQuote()">Add Quote</button> 
      <button onclick="exportToJson()">Export JSON</button> 
      <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
  `;

  return addQuoteSection; // Give back the form container
}

// Create the add quote form and put it on the page.
const addQuoteForm = createAddQuoteForm();
document.body.appendChild(addQuoteForm);

// Function to show a random quote.
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length); // Pick a random number
  quoteDisplay.textContent = quotes[randomIndex].text; // Display the quote
}

// Function to add a new quote to our collection.
function addNewQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim(); // Get the quote text
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim(); // And the category

  // Make sure they entered something in both fields.
  if (!quoteText || !quoteCategory) {
      alert("Please fill in both the quote and its category.");
      return;
  }

  quotes.push({ text: quoteText, category: quoteCategory }); // Add the new quote
  saveQuotes(); // Save our updated quotes

  document.getElementById("newQuoteText").value = ""; // Clear the input fields
  document.getElementById("newQuoteCategory").value = "";

  showRandomQuote(); // Show a new random quote
  populateCategories(); // Update the category dropdown
}

// Function to export the quotes to a JSON file.
function exportToJson() {
  const jsonString = JSON.stringify(quotes, null, 2); // Make a nice-looking JSON string

  const blob = new Blob([jsonString], { type: 'application/json' }); // Create a Blob
  const url = URL.createObjectURL(blob); // Create a URL for the Blob

  // Make a link to download the file.
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json'; // Name the file
  document.body.appendChild(a); // Add the link to the page
  a.click(); // Simulate a click to download
  document.body.removeChild(a); // Clean up
  URL.revokeObjectURL(url); // Clean up the URL
}

// Function to import quotes from a JSON file.
function importFromJsonFile(event) {
  const fileReader = new FileReader(); // To read the file
  fileReader.onload = function (event) {
      try {
          const importedQuotes = JSON.parse(event.target.result); // Get the quotes from the JSON
          quotes.push(...importedQuotes); // Add them to our collection
          saveQuotes(); // Save the updated quotes
          showRandomQuote(); // Show a new random quote
          populateCategories(); // Update the category dropdown
          alert('Quotes imported successfully!');
      } catch (error) {
          alert('Error importing quotes. Invalid JSON format.');
          console.error("JSON parsing error:", error);
      }
  };
  fileReader.readAsText(event.target.files[0]); // Read the file
}

// The category filter dropdown. Make sure you have this in your HTML with the ID "categoryFilter".
const categoryFilter = document.getElementById("categoryFilter");

// Function to fill the category dropdown with the available categories.
function populateCategories() {
  const categories = new Set(); // Use a Set to get only the unique categories
  quotes.forEach(quote => categories.add(quote.category)); // Add each quote's category

  categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Start with the "All Categories" option

  categories.forEach(category => {
      const option = document.createElement('option'); // Make a new dropdown option
      option.value = category; // Set the value
      option.text = category; // Set the displayed text
      categoryFilter.appendChild(option); // Add it to the dropdown
  });

  // Remember the last selected filter.
  const lastFilter = localStorage.getItem('lastFilter') || 'all'; // Get the last one, or default to "all"
  categoryFilter.value = lastFilter; // Set the dropdown to the last selection
  filterQuotes(); // Apply the filter
}

// Function to filter the quotes based on the selected category.
function filterQuotes() {
  const selectedCategory = categoryFilter.value; // Which category did they choose?
  localStorage.setItem('lastFilter', selectedCategory); // Save their choice for next time

  // Filter the quotes. Show all if "all" is selected, otherwise filter by category.
  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);

  // Clear the quote display. This is *essential* to avoid showing the wrong quotes.
  quoteDisplay.innerHTML = "";

  // Now add the filtered quotes to the display.
  filteredQuotes.forEach(quote => {
      const quoteElement = document.createElement('p'); // Make a paragraph for each quote
      quoteElement.textContent = `"${quote.text}" - ${quote.category}`; // Put the quote text in the paragraph
      quoteDisplay.appendChild(quoteElement); // Add the paragraph to the display
  });

}

// Set up the category dropdown when the page loads.
populateCategories();

// Listen for changes to the category dropdown. When it changes, filter the quotes.
categoryFilter.addEventListener("change", filterQuotes);