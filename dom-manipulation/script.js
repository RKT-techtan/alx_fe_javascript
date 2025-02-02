// script.js

let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Trials make you stronger.", category: "Motivation" },
  { text: "Everyone has something to offer.", category: "Inspiration" },
  { text: "Daydreaming is important, but work hard too.", category: "Vision" },
  { text: "Have a clear vision, not just wishful thinking.", category: "Clarity" },
  { text: "Small steps add up to big changes.", category: "Vision" },
  { text: "Goals give you direction, not destiny.", category: "Motivation" },
  { text: "We're all experts in our own little worlds. Sometimes we need help in a different world.", category: "Clarity" },
];

const showRandomQuote = () => {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const quoteText = document.getElementById('quote-text');
  const quoteCategory = document.getElementById('quote-category');

  quoteText?.textContent = quote.text;
  quoteCategory?.textContent = quote.category;

  if (!quoteText || !quoteCategory) {
    console.error("Quote elements not found in the DOM. Check your HTML.");
  }
};

const createAddQuoteForm = () => {
  const formContainer = document.getElementById('add-quote-form');

  if (!formContainer) {
    console.error("Form container not found.  Make sure you have an element with id 'add-quote-form' in your HTML.");
    return;
  }

  formContainer.innerHTML = `
    <form id="new-quote-form">
      <label for="quote-text">Quote:</label><br>
      <textarea id="new-quote-text" name="quote-text" required></textarea><br><br>
      <label for="quote-category">Category:</label><br>
      <input type="text" id="new-quote-category" name="quote-category" required><br><br>
      <button type="submit">Add Quote</button>
    </form>
  `;

  document.getElementById('new-quote-form').addEventListener('submit', addNewQuote);
};

const addNewQuote = (event) => {
  event.preventDefault();

  const quoteText = document.getElementById('new-quote-text').value.trim();
  const quoteCategory = document.getElementById('new-quote-category').value.trim();

  if (!quoteText || !quoteCategory) {
    alert("Please fill in both the quote and category fields.");
    return;
  }

  const newQuote = { text: quoteText, category: quoteCategory };
  quotes.push(newQuote);
  localStorage.setItem('quotes', JSON.stringify(quotes));

  document.getElementById('new-quote-text').value = "";
  document.getElementById('new-quote-category').value = "";

  showRandomQuote();
  document.getElementById('add-quote-form').innerHTML = ""; // Or just hide it: style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => {
  showRandomQuote();
  createAddQuoteForm();
});