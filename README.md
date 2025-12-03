# LeetCode Metrics

A simple web application to track and display your LeetCode statistics locally.

## 🚀 Project Overview

**LeetCode Metrics** is a lightweight tool designed to help you understand and track your LeetCode progress.  
It demonstrates how to build a small full-stack application using:

- **Frontend:** Static HTML, CSS, JavaScript  
- **Backend:** Node.js server (`server.js`)  
- **Purpose:** Learn how data fetching, UI rendering, and simple dashboard logic works

You can extend this project to fetch real LeetCode user data, visualize progress, or create your own coding dashboard.

## 📁 Folder Structure

```
leetcode-metrics/
│
├── public/              # Front-end static files
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── logo.png
│   └── favicon.ico
│
├── server.js            # Node.js backend server
├── package.json         # Project metadata
└── .gitignore           # Git ignore rules (node_modules, env files, etc.)
```

## 🔧 Requirements

- Node.js (v14+ recommended)  
- npm (comes bundled with Node.js)

## ⚙️ Installation & Running Locally

```bash
# Clone the repository
git clone https://github.com/debug-node/leetcode-metrics.git
cd leetcode-metrics

# Install dependencies
npm install

# Start the server
npm start
```

- Then open your browser and navigate to:  
👉 **http://localhost:5000**

## 🧠 How It Works

- `server.js` creates a simple Node.js server to serve the static frontend files.
- The `public/` folder contains the UI:  
  - `index.html` (structure)  
  - `style.css` (design)  
  - `script.js` (logic)  
- The app can be extended to integrate APIs, visualize real metrics, or add authentication.

## 📌 Future Improvements

Here are some enhancements you can add:

- Integrate LeetCode APIs or scraping logic to fetch real user data  
- Add charts using Chart.js or D3.js  
- Store data using MongoDB or SQLite  
- Add user authentication  
- Improve UI/UX and make it fully responsive

## 🤝 Contributions

Feel free to open issues or submit pull requests if you want to improve the project.  
Feedback and suggestions are always welcome!

## 📄 License

This project is open-source. You are free to use, modify, and distribute it.

## 👤 Author
- **debug-node**

🌐 [GitHub Profile](https://github.com/debug-node)

> _“Code. Learn. Build. Repeat.”_ 💻