let clickCount = 0;
let currentUser = null;
const catImage = document.getElementById('catImage');
const clickCounter = document.getElementById('clickCounter');
const userForm = document.getElementById('userForm');
const registrationContainer = document.getElementById('registration');
const gameContainer = document.getElementById('game');
const welcomeMessage = document.getElementById('welcomeMessage');
const leaderboardElement = document.getElementById('leaderboard');

// Event listener for the registration form submission
userForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form from reloading the page
    const username = document.getElementById('username').value;
    const walletAddress = document.getElementById('walletAddress').value;

    // Basic validation of the Solana wallet address
    if (validateSolanaAddress(walletAddress)) {
        // Store user details locally
        currentUser = { username, walletAddress, score: 0 };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        startGame();
    } else {
        alert('Invalid Solana Wallet Address. Please try again.');
    }
});

// Validate Solana address (simple length check; for more complex checks, use Solana SDK)
function validateSolanaAddress(address) {
    return address.length === 44; // Solana addresses are typically 44 characters long
}

// Function to start the game after registration
function startGame() {
    registrationContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    welcomeMessage.textContent = `Welcome, ${currentUser.username}!`;
    updateLocalLeaderboard();
}

// Function to handle cat click and update score
function popCat() {
    clickCount++;
    clickCounter.textContent = clickCount;

    // Update local score and leaderboard
    currentUser.score = clickCount;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateLocalLeaderboard();
}

// Function to update and display local leaderboard
function updateLocalLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const userIndex = leaderboard.findIndex(user => user.walletAddress === currentUser.walletAddress);

    // Update or add the user's score in the leaderboard
    if (userIndex >= 0) {
        leaderboard[userIndex].score = currentUser.score;
    } else {
        leaderboard.push(currentUser);
    }

    // Sort and limit to top 10 scores
    leaderboard.sort((a, b) => b.score - a.score).slice(0, 10);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    displayLeaderboard(leaderboard);
}

// Function to display leaderboard in HTML
function displayLeaderboard(leaderboard) {
    leaderboardElement.innerHTML = '<h2>Leaderboard</h2>';
    leaderboard.forEach((entry, index) => {
        leaderboardElement.innerHTML += `<p>${index + 1}. ${entry.username} (${entry.walletAddress}) - ${entry.score} clicks</p>`;
    });
}

// On page load, check if a user is already registered
window.onload = () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        startGame();
    }
};
