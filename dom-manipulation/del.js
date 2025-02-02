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
  }
  
  // Function to create the "add quote" form.
  function createAddQuoteForm() {
      const form = document.createElement("form");
      form.id = "add-quote-form";
  
      const textInput = document.createElement("input");
      textInput.type = "text";
      textInput.id = "quote-text-input";
      textInput.placeholder = "Enter quote text";
      form.appendChild(textInput);
  
      const categoryInput = document.createElement("input");
      categoryInput.type = "text";
      categoryInput.id = "quote-category-input";
      categoryInput.placeholder = "Enter category";
      form.appendChild(categoryInput);
  
      const submitButton = document.createElement("button");
      submitButton.type = "submit";
      submitButton.textContent = "Add Quote";
      form.appendChild(submitButton);
  
      form.addEventListener("submit", handleAddQuote);
      document.body.appendChild(form);
  }
  
  // Function to handle adding a new quote.
  function handleAddQuote(event) {
      event.preventDefault();
      const text = document.getElementById("quote-text-input").value;
      const category = document.getElementById("quote-category-input").value;
  
      if (text.trim() === "" || category.trim() === "") {
          alert("Please enter both quote text and category.");
          return;
      }
  
      const newQuote = { text: text, category: category };
      quotes.push(newQuote);
      saveQuotes();
      document.getElementById("quote-text-input").value = "";
      document.getElementById("quote-category-input").value = "";
      alert("Quote added successfully!");
      populateCategories();
      filterQuotes();
  }
  
  // Function to export quotes to JSON.
  function exportToJson() {
      const jsonString = JSON.stringify(quotes, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'quotes.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  }
  
  // Function to import quotes from a JSON file.
  function importFromJsonFile(event) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
              try {
                  const importedQuotes = JSON.parse(e.target.result);
                  if (Array.isArray(importedQuotes)) {
                      quotes = importedQuotes;
                      saveQuotes();
                      populateCategories();
                      filterQuotes();
                      alert("Quotes imported successfully!");
                  } else {
                      alert("Invalid JSON file. Must be an array of quote objects.");
                  }
              } catch (error) {
                  alert("Error parsing JSON file: " + error.message);
              }
          };
          reader.readAsText(file);
      }
  }
  
  // Function to save quotes to local storage.
  function saveQuotes() {
      localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Function to populate the category dropdown.
  function populateCategories() {
      const categorySelect = document.getElementById("categoryFilter");
  
      if (!categorySelect) {
          console.error("Category filter element not found in HTML");
          return;
      }
  
      const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
      categorySelect.innerHTML = "";
  
      const allOption = document.createElement("option");
      allOption.value = "all";
      allOption.text = "All Categories";
      categorySelect.appendChild(allOption);
  
      uniqueCategories.forEach(category => {
          const option = document.createElement("option");
          option.value = category;
          option.text = category;
          categorySelect.appendChild(option);
      });
  
      const lastSelectedCategory = localStorage.getItem('selectedCategory') || 'all';
      categorySelect.value = lastSelectedCategory;
  
      categorySelect.addEventListener("change", filterQuotes);
  }
  
  // Function to filter quotes by category.
  function filterQuotes() {
      const selectedCategory = document.getElementById("categoryFilter").value;
      localStorage.setItem('selectedCategory', selectedCategory);
      const quoteDisplay = document.getElementById("quoteDisplay");
  
      if (!quoteDisplay) {
          console.error("Quote display element not found in HTML");
          return;
      }
  
      if (selectedCategory === "all") {
          showRandomQuote();
          return;
      }
  
      const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  
      if (filteredQuotes.length > 0) {
          const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
          const randomQuote = filteredQuotes[randomIndex];
          quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p>- ${randomQuote.category}</p>`;
      } else {
          quoteDisplay.innerHTML = "<p>No quotes in this category yet.</p>";
      }
  }
  
  // Event listener for when the page content is loaded.
  window.addEventListener('DOMContentLoaded', () => {
      const storedQuotes = JSON.parse(localStorage.getItem('quotes'));
      if (storedQuotes && Array.isArray(storedQuotes) && storedQuotes.length > 0) {
          quotes = storedQuotes;
          populateCategories();
          filterQuotes();
      } else {
          fetchQuotesFromServer(); // Fetch from server if no local data
      }
  
      createAddQuoteForm();
  });