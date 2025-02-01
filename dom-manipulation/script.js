const quotes = [
  { text: "You learn through trials.", category: "Motivation" },
  { text: "Even a follower is as important as the leader.", category: "Inspiration" },
  { text: "Dreamland is as important as working hard.", category: "Vision" },
  { text: "Build with vision not hopes", category: "Clarity" },
  { text: "Small steps everyday", category: "Vision" },
  { text: "Goals are a motivation, not a seal on your future", category: "Motivation" },
  { text: "Everyone is smart in their world, depends what world we need fixing at the time", category: "Clarity" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

newQuoteButton.addEventListener("click", showRandomQuote);

showRandomQuote();

const addQuoteSection = document.createElement("div");
addQuoteSection.innerHTML = `
<input type="text" id="newQuoteText" placeholder="New quote">
<input type="text" id="newQuoteCategory" placeholder="Category">
<button onclick="addNewQuote()">Add Quote</button>
`;
document.body.appendChild(addQuoteSection);

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.textContent = quotes[randomIndex].text;
}

function addNewQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!quoteText || !quoteCategory) {
      alert("Please fill in both the quote and its category.");
      return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  showRandomQuote();
}