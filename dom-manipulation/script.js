
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


async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
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

    if (Array.isArray(data)) {
      const transformedQuotes = data.map(post => ({
        text: post.title,
        category: "General",
      }));
      quotes = transformedQuotes;
    } else if (typeof data === 'object' && data !== null) {
      const newQuote = {
        text: data.title, 
        category: "General",
      };
      quotes.push(newQuote);
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


async function syncQuotes() {
  try {
    const response = await fetch('/api/quotes', {
      method: 'POST',
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


function showRandomQuote(filteredQuotes = quotes) { 
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");

  if (quoteDisplay) {
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p>- ${randomQuote.category}</p>`;
  } else {
    console.error("Quote display element not found in HTML");
  }
}


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

  syncQuotes();
}


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

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");

  if (!categorySelect) {
    console.error("Category filter element not found in HTML");
    return;
  }

  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

  categorySelect.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "All";
  allOption.text = "All";
  categorySelect.appendChild(allOption);

  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.text = category;
    categorySelect.appendChild(option);
  });

  categorySelect.addEventListener("change", filterQuotes);
}

function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;

  const filteredQuotes = selectedCategory === "All" 
    ? quotes 
    : quotes.filter(quote => quote.category === selectedCategory);

  showRandomQuote(filteredQuotes); 
}


createAddQuoteForm();
populateCategories();
showRandomQuote();


setInterval(showRandomQuote, 5000);


console.log("Quotes synced with server!");