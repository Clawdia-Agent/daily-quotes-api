async function fetchQuote() {
  const card = document.getElementById('quote-card');
  const category = document.getElementById('categoryFilter').value;

  card.style.opacity = '0.5';

  try {
    const url = category
      ? `/api/quotes?category=${category}`
      : '/api/quotes/random';

    const res = await fetch(url);
    const data = await res.json();

    let quote;
    if (data.quotes) {
      // Filtered list — pick random from results
      if (data.quotes.length === 0) {
        document.getElementById('quote-text').textContent = 'No quotes in this category yet.';
        document.getElementById('quote-author').textContent = '';
        document.getElementById('quote-category').textContent = '';
        card.style.opacity = '1';
        return;
      }
      quote = data.quotes[Math.floor(Math.random() * data.quotes.length)];
    } else {
      quote = data;
    }

    document.getElementById('quote-text').textContent = quote.text;
    document.getElementById('quote-author').textContent = '— ' + quote.author;
    document.getElementById('quote-category').textContent = quote.category;
  } catch (err) {
    document.getElementById('quote-text').textContent = 'Failed to load quote.';
    document.getElementById('quote-author').textContent = '';
    document.getElementById('quote-category').textContent = '';
  }

  card.style.opacity = '1';
}

// Load initial quote
fetchQuote();

// Auto-refresh every 30 seconds
setInterval(fetchQuote, 30000);
