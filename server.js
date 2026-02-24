const express = require("express");
const fetch = require("node-fetch"); // v2
const cors = require("cors");
const path = require("path");
const favicon = require("serve-favicon");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
app.use(cors());
app.use(express.json());

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// API route
app.post("/api/user", async (req, res) => {
	const { username } = req.body;

	if (!username) return res.status(400).json({ error: "Username is required" });

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
		const response = await fetch("https://leetcode.com/graphql/", {
			method: "POST",
			headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
			body: JSON.stringify({ query, variables: { username } }),
		});

		if (!response.ok) throw new Error("Failed to fetch data from LeetCode");

		const data = await response.json();
		if (!data.data || !data.data.matchedUser) return res.status(404).json({ error: "User not found" });

		res.json(data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
