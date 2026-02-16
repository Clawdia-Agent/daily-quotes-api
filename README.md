# Daily Quotes API

A lightweight REST API serving inspirational quotes, with a minimal dark-themed web frontend.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## Quick Start

```bash
npm start
# → http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/quotes` | List all quotes |
| `GET` | `/api/quotes?category=wisdom` | Filter by category |
| `GET` | `/api/quotes/random` | Get a random quote |
| `GET` | `/api/quotes/:id` | Get quote by ID |
| `POST` | `/api/quotes` | Create a new quote |
| `DELETE` | `/api/quotes/:id` | Delete a quote |

### Create a quote

```bash
curl -X POST http://localhost:3000/api/quotes \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world", "author": "Dev", "category": "programming"}'
```

### Get a random quote

```bash
curl http://localhost:3000/api/quotes/random
```

## Categories

`motivation` · `wisdom` · `innovation` · `programming` · `design` · `perseverance`

## Docker

```bash
docker build -t daily-quotes .
docker run -p 3000:3000 daily-quotes
```

## Project Structure

```
├── server.js          # HTTP server + API routes
├── lib/quotes.js      # Data model + storage
├── data/quotes.json   # Quote database (JSON)
├── public/
│   ├── index.html     # Web frontend
│   ├── style.css      # Dark theme styles
│   └── app.js         # Client-side JS
├── Dockerfile
└── package.json
```

## License

MIT
