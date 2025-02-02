let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "You learn through trials.", category: "Motivation" },
  { text: "Even a follower is as important as the leader.", category: "Inspiration" },
  { text: "Dreamland is as important as working hard.", category: "Vision" },
  { text: "Build with vision not hopes", category: "Clarity" },
  { text: "Small steps everyday", category: "Vision" },
  { text: "Goals are a motivation, not a seal on your future", category: "Motivation" },
  { text: "Everyone is smart in their world, depends what world we need fixing at the time", category: "Clarity" },
];

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
newQuoteButton.addEventListener("click", showRandomQuote);
showRandomQuote();

function createAddQuoteForm() {
  const addQuoteSection = document.createElement("div");
  addQuoteSection.innerHTML = `
      <input type="text" id="newQuoteText" placeholder="New quote">
      <input type="text" id="newQuoteCategory" placeholder="Category">
      <button onclick="addNewQuote()">Add Quote</button> 
      <button onclick="exportToJson()">Export JSON</button> 
      <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
  `;
  return addQuoteSection;
}

const addQuoteForm = createAddQuoteForm();
document.body.appendChild(addQuoteForm);

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.textContent = quotes[randomIndex].text;
}

// Simulate server data
let serverQuotes = [
  { text: "Server Quote 1", category: "Server" },
  { text: "Server Quote 2", category: "Server" },
];

async function fetchServerQuotes() {
  return new Promise(resolve => {
      setTimeout(() => {
          resolve(serverQuotes);
      }, 500);
  });
}

async function sendQuotesToServer(quotesToSend) {
  return new Promise(resolve => {
      setTimeout(() => {
          serverQuotes = quotesToSend;
          resolve();
      }, 500);
  });
}

async function syncWithServer() {
  try {
      const fetchedQuotes = await fetchServerQuotes();
      const serverQuotesLength = serverQuotes.length;
      const localQuotesLength = quotes.length;
      quotes = fetchedQuotes; // Server data wins
      saveQuotes();
      showRandomQuote();
      populateCategories();

      const notification = document.getElementById("notification");
      notification.textContent = "Quotes synced with server.";
      notification.style.display = "block";

      setTimeout(() => {
          notification.style.display = "none";
      }, 3000);
      if (serverQuotesLength !== localQuotesLength) {
          console.warn("Quotes synced with server. Server and local quotes are not equal. Conflict might have occurred.")
      }
      console.log("Quotes synced with server.");
  } catch (error) {
      console.error("Error syncing with server:", error);
      const notification = document.getElementById("notification");
      notification.textContent = "Error syncing with server. Check the console.";
      notification.style.display = "block";
      setTimeout(() => {
          notification.style.display = "none";
      }, 5000);
  }
}

syncWithServer();
setInterval(syncWithServer, 5000);


async function addNewQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!quoteText || !quoteCategory) {
      alert("Please fill in both the quote and its category.");
      return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });
  await sendQuotesToServer(quotes); // Send to server FIRST
  saveQuotes(); // THEN update local
  

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  showRandomQuote();
  populateCategories();
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
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
      try {
          const importedQuotes = JSON.parse(event.target.result);
          quotes.push(...importedQuotes);
          saveQuotes();
          showRandomQuote();
          populateCategories();
          alert('Quotes imported successfully!');
      } catch (error) {
          alert('Error importing quotes. Invalid JSON format.');
          console.error("JSON parsing error:", error);
      }
  };
  fileReader.readAsText(event.target.files[0]);
}

const categoryFilter = document.getElementById("categoryFilter");

function populateCategories() {
  const categories = new Set();
  quotes.forEach(quote => categories.add(quote.category));
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.text = category;
      categoryFilter.appendChild(option);
  });
  const lastFilter = localStorage.getItem('lastFilter') || 'all';
  categoryFilter.value = lastFilter;
  filterQuotes();
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem('lastFilter', selectedCategory);
  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  quoteDisplay.innerHTML = "";
  filteredQuotes.forEach(quote => {
      const quoteElement = document.createElement('p');
      quoteElement.textContent = `"${quote.text}" - ${quote.category}`;
      quoteDisplay.appendChild(quoteElement);
  });
}

populateCategories();
categoryFilter.addEventListener("change", filterQuotes);