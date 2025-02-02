// script.js
const quotesKey = "quotes"; // Key for local storage
const lastViewedQuoteKey = "lastViewedQuote"; // Key for session storage

let quotes = JSON.parse(localStorage.getItem(quotesKey)) || [
  { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Hope" },
];

// Load last viewed quote from session storage (optional)
const lastViewedQuoteIndex = sessionStorage.getItem(lastViewedQuoteKey);
if (lastViewedQuoteIndex && quotes[lastViewedQuoteIndex]) {
    showQuote(quotes[lastViewedQuoteIndex]);
} else {
    showRandomQuote(); // Show random quote if no last viewed quote
}


function showQuote(quote) { // Helper function to display a specific quote
  const quoteTextElement = document.getElementById("quoteText");
  const quoteCategoryElement = document.getElementById("quoteCategory");

  if (quoteTextElement && quoteCategoryElement) {
    quoteTextElement.textContent = quote.text;
    quoteCategoryElement.textContent = `- ${quote.category}`;
  } else {
    console.error("Quote text or category element not found!");
  }
}


function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

    showQuote(randomQuote);

    // Save last viewed quote to session storage (optional)
    sessionStorage.setItem(lastViewedQuoteKey, randomIndex);
}

function createAddQuoteForm() { /* ... (same as before) ... */ }

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText !== "" && newQuoteCategory !== "") {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes(); // Save to local storage

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    showRandomQuote();

    console.log("Quote added:", newQuote);
  } else {
    alert("Please enter both a quote and a category.");
  }
}

function saveQuotes() {
  localStorage.setItem(quotesKey, JSON.stringify(quotes));
}

function exportToJson() {
  const jsonString = JSON.stringify(quotes, null, 2); // Beautified JSON

  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) {
    return; // No file selected
  }

  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);

      // Validate imported data (optional but recommended)
      if (Array.isArray(importedQuotes) && importedQuotes.every(quote => quote.text && quote.category)) {
        quotes = importedQuotes; // Replace existing quotes
        saveQuotes();
        showRandomQuote(); // Update displayed quote
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON file. Please ensure it contains an array of quote objects with "text" and "category" properties.');
      }

    } catch (error) {
      alert('Error parsing JSON file: ' + error.message);
    }
  };
  fileReader.readAsText(file);
  event.target.value = ''; // Clear the file input after import
}



document.addEventListener('DOMContentLoaded', () => {
  // ... (rest of DOMContentLoaded event listener - same as before) ...

    const exportButton = document.getElementById("exportButton");
    if (exportButton) {
        exportButton.addEventListener("click", exportToJson);
    } else {
        console.error("Export button not found!");
    }

    const importFileElement = document.getElementById('importFile');
    if(importFileElement) {
        importFileElement.addEventListener('change', importFromJsonFile);
    } else {
        console.error("Import file element not found!");
    }
});