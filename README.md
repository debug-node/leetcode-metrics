# LeetCode Metrics

LeetCode Metrics is a lightweight full-stack app that fetches and displays LeetCode progress by difficulty (Easy/Medium/Hard) with submission stats.

## Live Demo

- https://leetcode-metrics-swart.vercel.app/

## Features

- Search any valid LeetCode username
- Difficulty-wise solved progress with animated circular charts
- Submission summary cards (overall + difficulty-wise)
- Responsive, modern UI (desktop + mobile)
- SEO-ready metadata (`robots.txt`, `sitemap.xml`, canonical tags)

## Tech Stack

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js + Express
- API Source: LeetCode GraphQL endpoint

## Project Structure

```text
leetcode-metrics/
├── public/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── logo.png
│   └── favicon.ico
├── server.js
├── package.json
└── README.md
```

## Requirements

- Node.js 16+
- npm

## Local Setup

```bash
npm install
npm start
```

Open:

- http://localhost:5000

## Environment Variables

- `PORT` (default: `5000`) — server port
- `ALLOWED_ORIGIN` (default: `http://localhost:<PORT>`) — allowed CORS origin
- `NODE_ENV` (`production` or development) — controls static cache behavior

PowerShell example:

```powershell
$env:PORT=5001
$env:ALLOWED_ORIGIN="http://localhost:5001"
$env:NODE_ENV="development"
npm start
```

## API

### `POST /api/user`

Request body:

```json
{
	"username": "leetcode_username"
}
```

Responses:

- `200` user stats payload
- `400` invalid username
- `404` user not found
- `429` rate limit exceeded
- `504` upstream timeout
- `500` internal/server or upstream error

## Security & Reliability

- `helmet` for secure HTTP headers
- Rate limiting on `/api/*`
- Strict username validation
- JSON payload size limit
- Timeout handling for upstream LeetCode requests
- Dev cache disabled for instant UI refresh while developing

## Troubleshooting

- If old UI appears, hard refresh (`Ctrl + F5`) once.
- If `EADDRINUSE` appears, run on another port:

```powershell
$env:PORT=5001
npm start
```

## Author

- Aditya Kumar
- GitHub: https://github.com/debug-node
