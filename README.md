# LeetCode Metrics

LeetCode Metrics is a lightweight full-stack app that fetches and displays LeetCode progress by difficulty (Easy/Medium/Hard) with submission stats.

## Live Demo

- https://leetcode-metrics-swart.vercel.app/

## Features

- Search any valid LeetCode username
- Difficulty-wise solved progress with animated circular charts
- Submission summary cards (overall + difficulty-wise)
- Responsive, modern UI (desktop + mobile)

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
│   ├── styles/
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   └── responsive.css
│   ├── script.js
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

PowerShell example:

```powershell
$env:PORT=5001
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
- `400` username is required
- `404` user not found
- `500` internal/server or upstream error

## Security & Reliability

- CORS enabled for cross-origin requests
- Basic request validation for username presence
- Graceful error handling for upstream LeetCode API failures

## Styling Structure

- `public/style.css` acts as the entry stylesheet.
- Actual styles are split by concern under `public/styles/` for easier maintenance.

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
