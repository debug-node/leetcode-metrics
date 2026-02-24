const express = require("express");
const fetch = require("node-fetch"); // v2
const cors = require("cors");
const path = require("path"); // for static files
const favicon = require("serve-favicon");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigin = process.env.ALLOWED_ORIGIN || `http://localhost:${PORT}`;
const usernameRegex = /^[a-zA-Z0-9_-]{1,15}$/;

app.disable("x-powered-by");

app.use(
	helmet({
		contentSecurityPolicy: false,
		crossOriginEmbedderPolicy: false,
	}),
);

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || origin === allowedOrigin) {
				return callback(null, true);
			}
			return callback(new Error("Not allowed by CORS"));
		},
		methods: ["GET", "POST", "OPTIONS"],
		optionsSuccessStatus: 204,
	}),
);

app.use(express.json({ limit: "10kb" }));

const apiLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 30,
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: "Too many requests. Please try again shortly." },
});

app.use("/api", apiLimiter);

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// Serve static files from "public" folder
app.use(
	express.static(path.join(__dirname, "public"), {
		maxAge: isProduction ? "1h" : 0,
		etag: true,
		setHeaders: (res, filePath) => {
			if (path.extname(filePath) === ".html" || !isProduction) {
				res.setHeader("Cache-Control", "no-store");
			}
		},
	}),
);

app.get("/health", (_req, res) => {
	res.status(200).json({ status: "ok" });
});

// API route
app.post("/api/user", async (req, res) => {
	const { username } = req.body;

	if (typeof username !== "string" || !usernameRegex.test(username)) {
		return res.status(400).json({ error: "Invalid username" });
	}

	const query = `
        query userSessionProgress($username: String!) {
            allQuestionsCount { difficulty count }
            matchedUser(username: $username) {
                submitStats {
                    acSubmissionNum { difficulty count submissions }
                    totalSubmissionNum { difficulty count submissions }
                }
            }
        }
    `;

	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);

		const response = await fetch("https://leetcode.com/graphql/", {
			method: "POST",
			headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
			body: JSON.stringify({ query, variables: { username } }),
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (!response.ok) throw new Error("Failed to fetch data from LeetCode");

		const data = await response.json();
		if (!data.data || !data.data.matchedUser) return res.status(404).json({ error: "User not found" });

		res.json(data);
	} catch (err) {
		if (err.name === "AbortError") {
			return res.status(504).json({ error: "LeetCode request timed out" });
		}
		res.status(500).json({ error: "Failed to fetch user data" });
	}
});

app.use((err, _req, res, _next) => {
	if (err.message === "Not allowed by CORS") {
		return res.status(403).json({ error: "Origin not allowed" });
	}
	return res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
