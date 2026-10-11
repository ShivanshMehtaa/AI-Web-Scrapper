# AI Web Page Summarizer

A full-stack app that takes a webpage URL, scrapes its text, and uses a free AI API (Groq) to generate a short summary.

**Live demo:** https://ai-web-scrapper-wine.vercel.app/
**Backend API:** https://ai-web-scrapper-api.onrender.com

## Tech Stack

- **Frontend:** React (Vite), react-markdown
- **Backend:** Node.js, Express, Axios, Cheerio
- **AI:** Groq API (free tier)

## How It Works

1. The user pastes a URL and clicks **Summarize**.
2. The React app sends `POST /api/summarize` with the URL.
3. The backend validates the URL, downloads the page, and extracts the main text with Cheerio.
4. The text is sent to the Groq API, which returns a summary.
5. The summary is sent back and displayed, with a loading state while it waits.

## Prerequisites

- Node.js 18 or newer
- A free Groq API key from https://console.groq.com

## Run Locally

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd <repo-folder>
```

### 2. Backend

```bash
cd backend
npm install
```

Create a file named `.env` **inside the `backend` folder** (copy `.env.example`):

```
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
```

Optional: set `GROQ_MODEL` to use a different Groq model (default is `openai/gpt-oss-20b`).

Start the server:

```bash
npm run dev
```

The API runs at http://localhost:5000.

### 3. Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create a file named `.env` **inside the `frontend` folder** (copy `.env.example`):

```
VITE_API_URL=http://localhost:5000
```

Start the app:

```bash
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Where the `.env` files go

| File         | Location        | Variables                                     |
| ------------ | --------------- | --------------------------------------------- |
| Backend env  | `backend/.env`  | `GROQ_API_KEY`, `PORT`, optional `GROQ_MODEL` |
| Frontend env | `frontend/.env` | `VITE_API_URL`                                |

Do not use quotes or semicolons in `.env` files. Restart the server after changing them.

## API

**POST** `/api/summarize`

Request body:

```json
{ "url": "https://en.wikipedia.org/wiki/Artificial_intelligence" }
```

Success response:

```json
{ "summary": "..." }
```

Errors return `{ "error": "message" }` with status `400` (invalid URL), `422` (page could not be read), or `502` (AI service failed).

## Limitations

- Only scrapes static HTML. Sites that need JavaScript to render, or that block bots, may return little or no text.
- Page text is trimmed to 12,000 characters before summarizing.
- Private and localhost URLs are blocked for security.
