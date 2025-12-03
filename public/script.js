document.addEventListener("DOMContentLoaded", function () {

    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress").parentElement;
    const mediumProgressCircle = document.querySelector(".medium-progress").parentElement;
    const hardProgressCircle = document.querySelector(".hard-progress").parentElement;
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) alert("Invalid Username");
        return isMatching;
    }

    async function fetchUserDetails(username) {
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch("/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });

            if (!response.ok) throw new Error("Unable to fetch User details");

            const parsedData = await response.json();
            displayUserData(parsedData);
        } catch (error) {
            statsContainer.innerHTML = `<p>${error.message}</p>`;
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.innerHTML = `${solved}/${total}<br>${progressDegree.toFixed(1)}%`;
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
                label.innerHTML = `${Math.floor(Math.min(currentValue, solved))}/${total}<br>${Math.min(percentage, 100).toFixed(1)}%`;
                requestAnimationFrame(step);
            } else {
                label.innerHTML = `${solved}/${total}<br>${percentage.toFixed(1)}%`;
            }
        }

        step();
    }

    function displayUserData(parsedData) {
        const totalEasy = parsedData.data.allQuestionsCount[1].count;
        const totalMedium = parsedData.data.allQuestionsCount[2].count;
        const totalHard = parsedData.data.allQuestionsCount[3].count;

        const solvedEasy = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedMedium = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedHard = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateProgress(solvedEasy, totalEasy, easyLabel, easyProgressCircle);
        updateProgress(solvedMedium, totalMedium, mediumLabel, mediumProgressCircle);
        updateProgress(solvedHard, totalHard, hardLabel, hardProgressCircle);

        animateProgress(solvedEasy, totalEasy, easyLabel, easyProgressCircle);
        animateProgress(solvedMedium, totalMedium, mediumLabel, mediumProgressCircle);
        animateProgress(solvedHard, totalHard, hardLabel, hardProgressCircle);


        const cardsData = [
            { label: "Overall Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions },
            { label: "Easy Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions },
            { label: "Medium Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions },
            { label: "Hard Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions },
        ];

        cardStatsContainer.innerHTML = cardsData.map(
            data => `<div class="card"><h4>${data.label}</h4><p>${data.value}</p></div>`
        ).join("");
    }

    searchButton.addEventListener("click", function () {
        const username = usernameInput.value;
        if (validateUsername(username))
            fetchUserDetails(username);
    });

    usernameInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const username = usernameInput.value;
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
        usernameInput.focus();
    });
});