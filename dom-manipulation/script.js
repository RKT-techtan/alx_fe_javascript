// This array holds our quotes. It's initially empty and will be populated
// from local storage or the server.
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "You learn through trials.", category: "Motivation" },
  { text: "Even a follower is as important as the leader.", category: "Inspiration" },
  { text: "Dreamland is as important as working hard.", category: "Vision" },
  { text: "Build with vision not hopes", category: "Clarity" },
  { text: "Small steps everyday", category: "Vision" },
  { text: "Goals are a motivation, not a seal on your future", category: "Motivation" },
  { text: "Everyone is smart in their world, depends what world we need fixing at the time", category: "Clarity" },
];

// Function to fetch quotes from the server (using POST and handling data transformation).
async function fetchQuotesFromServer() {
  try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', { // Your API endpoint (REPLACE THIS!)
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ // Data to send in the POST request body (REPLACE THIS!)
              title: 'New Quote Title',
              body: 'New Quote Body',
              userId: 1,
          }),
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle the response – it could be a single object (POST response) or an array (initial data).
      if (Array.isArray(data)) {
          const transformedQuotes = data.map(post => ({ // Transform posts to quotes
              text: post.title, // Adapt this based on your API response
              category: "General", // Adapt this based on your API response
          }));
          quotes = transformedQuotes;
      } else if (typeof data === 'object' && data !== null) {
          const newQuote = {
              text: data.title, // Adapt this based on your API response
              category: "General", // Adapt this based on your API response
          };
          quotes.push(newQuote);
      } else {
          console.error("Unexpected data format from server:", data);
          quoteDisplay.innerHTML = "<p>Error loading quotes.</p>";
          return; // Stop processing if data is invalid
      }

      saveQuotes();
      populateCategories();
      filterQuotes();

  } catch (error) {
      console.error("Error fetching quotes from server:", error);
      quoteDisplay.innerHTML = "<p>Error loading quotes.</p>";
  }
}

// Function to synchronize quotes with the server (if needed).
async function syncQuotes() {
  try {
      const response = await fetch('/api/quotes', { // Your API endpoint for syncing
          method: 'POST', // Or PUT, depending on your API
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(quotes) // Send the current quotes to the server
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Process the response from the server (optional)
      console.log("Quotes synced successfully:", data); // Or update quotes based on server response

  } catch (error) {
      console.error("Error syncing quotes with server:", error);
      // Handle error, e.g., notify the user
  }
}


// This function shows a random quote on the page.
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (quoteDisplay) {
      quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p>- ${randomQuote.category}</p>`;
  } else {
      console.error("Quote display element not found in HTML");
  }
}

// ... (rest of the code - createAddQuoteForm, handleAddQuote, exportToJson, importFromJsonFile, saveQuotes)

function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");

  if (!categorySelect) {
      console.error("Category filter element not found in HTML");
      return;
  }

  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

  categorySelect.innerHTML = '<option value="">All Categories</option>'; // Add "All Categories" option

  uniqueCategories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.text = category;
      categorySelect.appendChild(option);
  });
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes = selectedCategory === "" ? quotes : quotes.filter(quote => quote.category === selectedCategory);

  // Now you can use filteredQuotes to display the quotes you want.  For example, to display a random quote from the filtered list:
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
}


// Call these functions after the DOM is fully loaded (e.g., in a DOMContentLoaded event listener)
document.addEventListener('DOMContentLoaded', () => {
  showRandomQuote();
  createAddQuoteForm();
  populateCategories(); // Call populateCategories after the DOM is ready
  filterQuotes();

  // Example of how to use the filter:
  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) {
      categoryFilter.addEventListener("change", filterQuotes);
  } else {
      console.error("Category filter element not found in HTML");
  }

  // Example of how to fetch quotes from the server (call when needed):
  // fetchQuotesFromServer();

});