// Array to hold the quotes, initialized from local storage or with default values.
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "You learn through trials.", category: "Motivation" },
  { text: "Even a follower is as important as the leader.", category: "Inspiration" },
  { text: "Dreamland is as important as working hard.", category: "Vision" },
  { text: "Build with vision not hopes", category: "Clarity" },
  { text: "Small steps everyday", category: "Vision" },
  { text: "Goals are a motivation, not a seal on your future", category: "Motivation" },
  { text: "Everyone is smart in their world, depends what world we need fixing at the time", category: "Clarity" },
];

// Variable to store the timeout ID for quote changes.
let quoteChangeTimeout;

// Function to fetch quotes from the server (using POST).  (You'll need to replace the URL)
async function fetchQuotesFromServer() {
  try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', { // Replace with your API endpoint
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              title: 'New Quote Title',
              body: 'New Quote Body',
              userId: 1,
          }),
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Process the data from the server (can be a single object or an array).
      if (Array.isArray(data)) {
          quotes = data.map(post => ({ text: post.title, category: "General" })); // Adapt mapping as needed
      } else if (typeof data === 'object' && data !== null) {
          quotes.push({ text: data.title, category: "General" }); // Adapt as needed
      } else {
          console.error("Unexpected data format from server:", data);
          quoteDisplay.innerHTML = "<p>Error loading quotes.</p>";
          return;
      }

      saveQuotes();
      populateCategories();
      filterQuotes();

  } catch (error) {
      console.error("Error fetching quotes from server:", error);
      quoteDisplay.innerHTML = "<p>Error loading quotes.</p>";
  }
}

// Function to sync quotes with the server. (Replace URL as needed)
async function syncQuotes() {
  try {
      const response = await fetch('/api/quotes', { // Replace with your API endpoint
          method: 'POST', // Or PUT, depending on your API
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(quotes)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Quotes synced successfully:", data);

  } catch (error) {
      console.error("Error syncing quotes with server:", error);
  }
}

// Function to display a random quote.
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (quoteDisplay) {
      quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p>- ${randomQuote.category}</p>`;
  } else {
      console.error("Quote display element not found in HTML");
  }

  clearTimeout(quoteChangeTimeout); // Clear any existing timeout
  quoteChangeTimeout = setTimeout(showRandomQuote, 5000); // Set a new timeout
}

// Function to create the form for adding new quotes.
function createAddQuoteForm() {
  // ... (Form creation code - same as before)
}

// Function to handle adding a new quote.
function handleAddQuote(event) {
  // ... (Quote adding logic - same as before)

  populateCategories();
  filterQuotes();
  syncQuotes();
}


// Function to export quotes as JSON.
function exportToJson() {
  // ... (JSON export logic - same as before)
}

// Function to import quotes from a JSON file.
function importFromJsonFile(event) {
  // ... (JSON import logic - same as before)
}

// Function to save quotes to local storage.
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to populate the category filter dropdown.
function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");

  if (!categorySelect) {
      console.error("Category filter element not found in HTML");
      return;
  }

  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

  categorySelect.innerHTML = '<option value="">All Categories</option>';

  uniqueCategories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.text = category;
      categorySelect.appendChild(option);
  });
}

// Function to filter quotes by category.
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes = selectedCategory === "" ? quotes : quotes.filter(quote => quote.category === selectedCategory);

  if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const randomQuote = filteredQuotes[randomIndex];
      const quoteDisplay = document.getElementById("quoteDisplay");

      if (quoteDisplay) {
          quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p>- ${randomQuote.category}</p>`;
      } else {
          console.error("Quote display element not found in HTML");
      }
  } else {
      const quoteDisplay = document.getElementById("quoteDisplay");
      if (quoteDisplay) {
          quoteDisplay.innerHTML = "<p>No quotes found for this category.</p>";
      }
  }

  clearTimeout(quoteChangeTimeout); // Clear any existing timeout
  quoteChangeTimeout = setTimeout(showRandomQuote, 5000); // Set a new timeout
}

// Event listener for DOMContentLoaded.
document.addEventListener('DOMContentLoaded', () => {
  showRandomQuote(); // Initial quote display and starts the timeout chain.
  createAddQuoteForm();
  populateCategories();
  filterQuotes(); // Display initial quote based on filter (or all).

  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) {
      categoryFilter.addEventListener("change", filterQuotes);
  } else {
      console.error("Category filter element not found in HTML");
  }

  // fetchQuotesFromServer(); // Call this if you want to fetch from the server on load.
});