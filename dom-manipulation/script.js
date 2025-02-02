// Array to hold our quote objects.  We try to get existing quotes from local storage.
// If there aren't any saved yet, we use some default quotes.
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "You learn through trials.", category: "Motivation" },
  { text: "Even a follower is as important as the leader.", category: "Inspiration" },
  { text: "Dreamland is as important as working hard.", category: "Vision" },
  { text: "Build with vision not hopes", category: "Clarity" },
  { text: "Small steps everyday", category: "Vision" },
  { text: "Goals are a motivation, not a seal on your future", category: "Motivation" },
  { text: "Everyone is smart in their world, depends what world we need fixing at the time", category: "Clarity" },
];

// Function to save the quotes array to local storage.  We'll use this whenever we change the quotes.
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Get the HTML element where we'll display the quote.  We assume you have an element with the ID "quoteDisplay".
const quoteDisplay = document.getElementById("quoteDisplay");

// Get the button that triggers showing a new quote.  We assume you have a button with the ID "newQuote".
const newQuoteButton = document.getElementById("newQuote");

// Add a "click" event listener to the "New Quote" button.  When clicked, it'll call the showRandomQuote function.
newQuoteButton.addEventListener("click", showRandomQuote);

// Show a quote when the page first loads.
showRandomQuote();

// Function to create the form for adding new quotes.  This builds the HTML for the input fields and button.
function createAddQuoteForm() {
  const addQuoteSection = document.createElement("div"); // Create a new div to hold the form

  // Use template literals to make the HTML easier to read.
  addQuoteSection.innerHTML = `
    <input type="text" id="newQuoteText" placeholder="New quote">
    <input type="text" id="newQuoteCategory" placeholder="Category">
    <button onclick="addNewQuote()">Add Quote</button> 
    <button onclick="exportToJson()">Export JSON</button> <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
  `;

  return addQuoteSection; // Return the div containing the form
}

// Create the add quote form and add it to the page.
const addQuoteForm = createAddQuoteForm();
document.body.appendChild(addQuoteForm);

// Function to display a random quote.
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length); // Get a random index within the quotes array
  quoteDisplay.textContent = quotes[randomIndex].text; // Set the quote text in the display element
}

// Function to add a new quote.
function addNewQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim(); // Get the new quote text and remove extra whitespace
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim(); // Get the new quote category

  // Make sure both fields are filled in.
  if (!quoteText || !quoteCategory) {
    alert("Please fill in both the quote and its category.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory }); // Add the new quote to the array
  saveQuotes(); // Save the updated quotes to local storage

  document.getElementById("newQuoteText").value = ""; // Clear the input fields
  document.getElementById("newQuoteCategory").value = "";

  showRandomQuote(); // Show a new random quote
  populateCategories(); // Update the category dropdown
}

// Function to export quotes to a JSON file.
function exportToJson() {
  const jsonString = JSON.stringify(quotes, null, 2); // Convert the quotes to a JSON string (nicely formatted)

  const blob = new Blob([jsonString], { type: 'application/json' }); // Create a Blob (binary large object) with the JSON data
  const url = URL.createObjectURL(blob); // Create a URL for the Blob

  // Create a link element to trigger the download.
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json'; // Set the filename
  document.body.appendChild(a); // Add the link to the page
  a.click(); // Simulate a click to start the download
  document.body.removeChild(a); // Remove the link from the page
  URL.revokeObjectURL(url); // Release the URL
}

// Function to import quotes from a JSON file.
function importFromJsonFile(event) {
  const fileReader = new FileReader(); // Create a FileReader to read the file content
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result); // Parse the JSON data
      quotes.push(...importedQuotes); // Add the imported quotes to the existing quotes array
      saveQuotes(); // Save the updated quotes to local storage
      showRandomQuote(); // Show a new random quote
      populateCategories(); // Update the category dropdown
      alert('Quotes imported successfully!');
    } catch (error) {
      alert('Error importing quotes. Invalid JSON format.');
      console.error("JSON parsing error:", error);
    }
  };
  fileReader.readAsText(event.target.files[0]); // Read the file as text
}

// --- New Code for Filtering ---

// Get the category filter dropdown.  Make sure you have this element in your HTML with the ID "categoryFilter".
const categoryFilter = document.getElementById("categoryFilter");

// Function to populate the category dropdown.
function populateCategories() {
  const categories = new Set(); // Use a Set to automatically store only unique categories
  quotes.forEach(quote => categories.add(quote.category)); // Add each quote's category to the Set

  categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset the dropdown options

  categories.forEach(category => {
    const option = document.createElement('option'); // Create a new option element
    option.value = category; // Set the option's value
    option.text = category; // Set the option's text
    categoryFilter.appendChild(option); // Add the option to the dropdown
  });

  // Restore the last selected filter from local storage (if there is one)
  const lastFilter = localStorage.getItem('lastFilter') || 'all'; // Get the last filter or default to "all"
  categoryFilter.value = lastFilter; // Set the dropdown to the last selected filter
  filterQuotes(); // Apply the filter after populating the categories
}

// Function to filter quotes based on the selected category.
function filterQuotes() {
  const selectedCategory = categoryFilter.value; // Get the currently selected category
  localStorage.setItem('lastFilter', selectedCategory); // Save the selected category to local storage

  // Filter the quotes array.  If "all" is selected, show all quotes. Otherwise, filter by category.
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);

    let quoteDisplayHtml = ""; // Start building the HTML string for the filtered quotes
    filteredQuotes.forEach(quote => {
      quoteDisplayHtml += `<p>"${quote.text}" - ${quote.category}</p>`; // Add each quote to the HTML string
    });

    quoteDisplay.innerHTML = quoteDisplayHtml; // Update the quote display with the filtered quotes
}

// Populate the categories when the page first loads.
populateCategories();

// Add an event listener to the category dropdown.  When the selection changes, call the filterQuotes function.
categoryFilter.addEventListener("change", filterQuotes);