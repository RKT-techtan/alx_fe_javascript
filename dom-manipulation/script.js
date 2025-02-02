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

// Function to fetch quotes from the server.  This is an *example*
// and you'll need to adapt it to your actual server-side setup.
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('/api/quotes'); // Replace with your API endpoint
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Check if the data is an array of quotes
        if (Array.isArray(data)) {
            quotes = data; // Update the quotes array with server data
            saveQuotes(); // Save to local storage
            populateCategories(); // Update category dropdown
            filterQuotes(); // Show a quote
        } else {
            console.error("Invalid data received from server. Expected an array of quotes.", data);
            // Optionally, display an error message to the user.
            quoteDisplay.innerHTML = "<p>Error loading quotes.</p>";
        }

    } catch (error) {
        console.error("Error fetching quotes from server:", error);
        // Handle the error, e.g., display a message to the user
        quoteDisplay.innerHTML = "<p>Error loading quotes.</p>";
    }
}


// This function shows a random quote on the page.
function showRandomQuote() {
    // Get a random number to pick a quote. Math.random() gives us a number
    // between 0 and 1. We multiply it by the number of quotes we have
    // and use Math.floor() to round it down to a whole number.
    const randomIndex = Math.floor(Math.random() * quotes.length);

    // Use the random number to get a quote from our array.
    const randomQuote = quotes[randomIndex];

    // Find the HTML element where we want to display the quote.
    // You MUST have an element with this ID in your HTML for this to work!
    const quoteDisplay = document.getElementById("quoteDisplay");

    // Check if the quote element exists before trying to use it.
    if (quoteDisplay) {
        // Put the quote text and category into the HTML element.
        quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p>- ${randomQuote.category}</p>`;
    } else {
        // If the element isn't found, tell us in the console. This helps with debugging.
        console.error("Quote display element not found in HTML");
    }
}

// This function creates the form for adding new quotes.
function createAddQuoteForm() {
    // Make a new form element.
    const form = document.createElement("form");
    form.id = "add-quote-form"; // Give it an ID so we can find it later

    // Add input elements for text and category, and a submit button
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

    // Add the form to the page. We're adding it to the <body>.
    document.body.appendChild(form); // Or wherever you want to add it
}

// This function handles adding a new quote.
function handleAddQuote(event) {
    // Stop the form from actually submitting (which would refresh the page).
    event.preventDefault();

    // Get the quote text and category from the input fields.
    const text = document.getElementById("quote-text-input").value;
    const category = document.getElementById("quote-category-input").value;

    // Make sure the user entered something.
    if (text.trim() === "" || category.trim() === "") {
        alert("Please enter both quote text and category.");
        return; // Don't add the quote if the fields are empty.
    }

    // Create a new quote object.
    const newQuote = { text: text, category: category };

    // Add the new quote to our array.
    quotes.push(newQuote);

    // Save the updated quotes array to local storage.
    saveQuotes();

    // Clear the form inputs.
    document.getElementById("quote-text-input").value = "";
    document.getElementById("quote-category-input").value = "";

    // Tell the user the quote was added.
    alert("Quote added successfully!");

    populateCategories(); // Update the category dropdown
    filterQuotes();       // Show a relevant quote
}

// Implement JSON Export
function exportToJson() {
    const jsonString = JSON.stringify(quotes, null, 2); // Beautified JSON
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json'; // Filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Implement JSON Import
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const importedQuotes = JSON.parse(e.target.result);
                if (Array.isArray(importedQuotes)) {
                    quotes = importedQuotes; // Replace existing quotes
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
    const categorySelect = document.getElementById("categoryFilter"); // Corrected ID

    if (!categorySelect) {
        console.error("Category filter element not found in HTML");
        return; // Exit if the element isn't there
    }

    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))]; // Get unique categories

    // Clear existing options (important to prevent duplicates)
    categorySelect.innerHTML = ""; // Clear all children

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.text = "All Categories"; // More descriptive
    categorySelect.appendChild(allOption);

    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.text = category;
        categorySelect.appendChild(option);
    });

    const lastSelectedCategory = localStorage.getItem('selectedCategory') || 'all'; // Default to "all"
    categorySelect.value = lastSelectedCategory;

    categorySelect.addEventListener("change", filterQuotes);
}

function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value; // Corrected ID
    localStorage.setItem('selectedCategory', selectedCategory);

    const quoteDisplay = document.getElementById("quoteDisplay"); // Use quoteDisplay

    if (!quoteDisplay) {
        console.error("Quote display element not found in HTML");
        return;
    }

    if (selectedCategory === "all") {
        showRandomQuote(); // Show a random quote from all categories
        return; // Important: Exit the
    }
  };