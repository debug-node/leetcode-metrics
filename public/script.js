document.addEventListener("DOMContentLoaded", function () {
	const searchButton = document.getElementById("search-btn");
	const usernameInput = document.getElementById("user-input");
	const statusMessage = document.getElementById("status-message");
	const easyProgressCircle = document.querySelector(".easy-progress").parentElement;
	const mediumProgressCircle = document.querySelector(".medium-progress").parentElement;
	const hardProgressCircle = document.querySelector(".hard-progress").parentElement;
	const easyLabel = document.getElementById("easy-label");
	const mediumLabel = document.getElementById("medium-label");
	const hardLabel = document.getElementById("hard-label");
	const cardStatsContainer = document.querySelector(".stats-cards");

	function setStatus(message, type = "info") {
		statusMessage.textContent = message;
		statusMessage.className = `status-message ${type}`;
	}

	function validateUsername(username) {
		if (username.trim() === "") {
			setStatus("Username should not be empty", "error");
			return false;
		}
		const regex = /^[a-zA-Z0-9_-]{1,15}$/;
		const isMatching = regex.test(username);
		if (!isMatching) setStatus("Invalid username format", "error");
		return isMatching;
	}

	function setLoadingState(isLoading) {
		searchButton.textContent = isLoading ? "Searching..." : "Search";
		searchButton.disabled = isLoading;
		usernameInput.disabled = isLoading;
	}

	async function fetchUserDetails(username) {
		try {
			setLoadingState(true);
			setStatus("Fetching user stats...", "info");

			const response = await fetch("/api/user", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username }),
			});

			const parsedData = await response.json();

			if (!response.ok) {
				throw new Error(parsedData.error || "Unable to fetch user details");
			}

			displayUserData(parsedData);
			setStatus("Stats loaded successfully", "success");
		} catch (error) {
			setStatus(error.message, "error");
		} finally {
			setLoadingState(false);
		}
	}

	function getCountByDifficulty(items, difficulty, fallbackField = "count") {
		const matched = items.find((item) => item.difficulty === difficulty);
		return matched ? matched[fallbackField] || 0 : 0;
	}

	function renderProgressLabel(label, solved, total, percentage) {
		label.textContent = "";
		label.append(`${solved}/${total}`, document.createElement("br"), `${percentage.toFixed(1)}%`);
	}

	function animateProgress(solved, total, label, circle) {
		const percentage = total ? (solved / total) * 100 : 0;
		const targetDegree = total ? (solved / total) * 360 : 0;
		let currentDegree = 0;
		let currentValue = 0;

		function step() {
			if (currentDegree < targetDegree) {
				currentDegree += targetDegree / 60; // ~60 frames
				currentValue += solved / 60;
				circle.style.setProperty("--progress-degree", `${Math.min(currentDegree, targetDegree)}deg`);
				renderProgressLabel(
					label,
					Math.floor(Math.min(currentValue, solved)),
					total,
					Math.min(percentage, 100),
				);
				requestAnimationFrame(step);
			} else {
				renderProgressLabel(label, solved, total, percentage);
			}
		}

		step();
	}

	function createCard(label, value) {
		const card = document.createElement("div");
		card.className = "card";

		const heading = document.createElement("h4");
		heading.textContent = label;

		const paragraph = document.createElement("p");
		paragraph.textContent = String(value);

		card.appendChild(heading);
		card.appendChild(paragraph);

		return card;
	}

	function displayUserData(parsedData) {
		const allQuestionsCount = parsedData?.data?.allQuestionsCount || [];
		const acSubmissionNum = parsedData?.data?.matchedUser?.submitStats?.acSubmissionNum || [];
		const totalSubmissionNum = parsedData?.data?.matchedUser?.submitStats?.totalSubmissionNum || [];

		const totalEasy = getCountByDifficulty(allQuestionsCount, "Easy");
		const totalMedium = getCountByDifficulty(allQuestionsCount, "Medium");
		const totalHard = getCountByDifficulty(allQuestionsCount, "Hard");

		const solvedEasy = getCountByDifficulty(acSubmissionNum, "Easy");
		const solvedMedium = getCountByDifficulty(acSubmissionNum, "Medium");
		const solvedHard = getCountByDifficulty(acSubmissionNum, "Hard");

		animateProgress(solvedEasy, totalEasy, easyLabel, easyProgressCircle);
		animateProgress(solvedMedium, totalMedium, mediumLabel, mediumProgressCircle);
		animateProgress(solvedHard, totalHard, hardLabel, hardProgressCircle);

		const cardsData = [
			{ label: "Overall Submissions", value: getCountByDifficulty(totalSubmissionNum, "All", "submissions") },
			{ label: "Easy Submissions", value: getCountByDifficulty(totalSubmissionNum, "Easy", "submissions") },
			{ label: "Medium Submissions", value: getCountByDifficulty(totalSubmissionNum, "Medium", "submissions") },
			{ label: "Hard Submissions", value: getCountByDifficulty(totalSubmissionNum, "Hard", "submissions") },
		];

		cardStatsContainer.textContent = "";
		cardsData.forEach((data) => {
			cardStatsContainer.appendChild(createCard(data.label, data.value));
		});
	}

	searchButton.addEventListener("click", function () {
		const username = usernameInput.value.trim();
		if (validateUsername(username)) fetchUserDetails(username);
	});

	usernameInput.addEventListener("keydown", function (event) {
		if (event.key === "Enter") {
			event.preventDefault();
			const username = usernameInput.value.trim();
			if (validateUsername(username)) {
				fetchUserDetails(username);
			}
		}
	});

	const clearBtn = document.getElementById("clear-input");

	usernameInput.addEventListener("input", () => {
		clearBtn.style.display = usernameInput.value ? "block" : "none";
	});

	clearBtn.addEventListener("click", () => {
		usernameInput.value = "";
		clearBtn.style.display = "none";
		setStatus("", "info");
		usernameInput.focus();
	});
});
