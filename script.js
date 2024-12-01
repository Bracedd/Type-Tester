const words = document.getElementById('words');
const input = document.getElementById('input');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const timeElement = document.getElementById('time');
const restartBtn = document.getElementById('restart');
const themeSwitch = document.getElementById('theme-switch');
const difficultySelector = document.getElementById('difficulty');
const historyDiv = document.getElementById('history');
const leaderboardDiv = document.getElementById('leaderboard');

let wordList = [];
let currentWordIndex = 0;
let correctCharacters = 0;
let totalCharacters = 0;
let startTime;
let timerInterval;

const wordBank = [
    "the", "be", "of", "and", "a", "to", "in", "he", "have", "it", "that", "for", "they", "with", "as", "not", "on", "she", "at", "by", "this", "we", "you", "do", "but", "from", "or", "which", "one", "would", "all", "will", "there", "say", "who", "make", "when", "can", "more", "if", "no", "man", "out", "other", "so", "what", "time", "up", "go", "about", "than", "into", "could", "state", "only", "new", "year", "some", "take", "come", "these", "know", "see", "use", "get", "like", "then", "first", "any", "work", "now", "may", "such", "give", "over", "think", "most", "even", "find", "day", "also", "after", "way", "many", "must", "look", "before", "great", "back", "through", "long", "where", "much", "should", "well", "people", "down", "own", "just", "because", "good", "each", "those", "feel", "seem", "how", "high", "too", "place", "little", "world", "very", "still", "nation", "hand", "old", "life", "tell", "write", "become", "here", "show", "house", "both", "between", "need", "mean", "call", "develop", "under", "last", "right", "move", "thing", "general", "school", "never", "same", "another", "begin", "while", "number", "part", "turn", "real", "leave", "might", "want", "point", "form", "off", "child", "few", "small", "since", "against", "ask", "late", "home", "interest", "large", "person", "end", "open", "public", "follow", "during", "present", "without", "again", "hold", "govern", "around", "possible", "head", "consider", "word", "program", "problem", "however", "lead", "system", "set", "order", "eye", "plan", "run", "keep", "face", "fact", "group", "play", "stand", "increase", "early", "course", "change", "help", "line"
];

const history = [];
const leaderboard = [];

function getRandomWords(count) {
    const shuffled = [...wordBank].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function displayWords() {
    words.innerHTML = wordList.map((word, index) =>
        `<span class="word ${index === currentWordIndex ? 'current' : ''}">${word}</span>`
    ).join(' ');
}

function updateStats() {
    const currentTime = (Date.now() - startTime) / 1000 / 60; // in minutes
    const wpm = Math.round((correctCharacters / 5) / currentTime);
    const accuracy = totalCharacters > 0 ? Math.round((correctCharacters / totalCharacters) * 100) : 100;

    wpmElement.textContent = wpm;
    accuracyElement.textContent = `${accuracy}%`;
}

function startTimer() {
    let timeLeft = 60;
    timeElement.textContent = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        timeElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            input.disabled = true;
            savePerformance();
            updateLeaderboard();
        }
    }, 1000);
}

function checkInput() {
    const currentWord = wordList[currentWordIndex];
    const typedWord = input.value.trim();

    if (typedWord === currentWord) {
        correctCharacters += currentWord.length;
        totalCharacters += currentWord.length;
        currentWordIndex++;
        input.value = '';

        if (currentWordIndex >= wordList.length) {
            wordList = wordList.concat(getRandomWords(10));
        }

        displayWords();
        updateStats();
    } else {
        const wordElement = document.querySelector('.word.current');
        wordElement.innerHTML = currentWord.split('').map((char, index) =>
            `<span class="${index < typedWord.length ? (char === typedWord[index] ? 'correct' : 'incorrect') : ''}">${char}</span>`
        ).join('');

        totalCharacters = correctCharacters + typedWord.length;
        updateStats();
    }
}

function savePerformance() {
    const wpm = parseInt(wpmElement.textContent);
    const accuracy = parseInt(accuracyElement.textContent);

    history.push({ wpm, accuracy });
    displayHistory();
}

function displayHistory() {
    historyDiv.innerHTML = '<h3>Performance History</h3>' +
        history.map(({ wpm, accuracy }) => `<p>WPM: ${wpm}, Accuracy: ${accuracy}%</p>`).join('');
}

function updateLeaderboard() {
    const wpm = parseInt(wpmElement.textContent);
    leaderboard.push(wpm);
    leaderboard.sort((a, b) => b - a);

    leaderboardDiv.innerHTML = '<h3>Leaderboard</h3>' +
        leaderboard.map((score, index) => `<p>${index + 1}. ${score} WPM</p>`).join('');
}

function restart() {
    clearInterval(timerInterval);
    input.disabled = false;
    input.value = '';
    currentWordIndex = 0;
    correctCharacters = 0;
    totalCharacters = 0;
    startTime = Date.now();

    wordList = getRandomWords(50);
    displayWords();
    updateStats();
    startTimer();
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme', themeSwitch.checked);
}

restartBtn.addEventListener('click', restart);
input.addEventListener('input', checkInput);
themeSwitch.addEventListener('change', toggleTheme);

difficultySelector.addEventListener('change', () => {
    const difficulty = difficultySelector.value;

    switch (difficulty) {
        case 'easy': wordList = getRandomWords(30); break;
        case 'medium': wordList = getRandomWords(50); break;
        case 'hard': wordList = getRandomWords(70); break;
    }

    restart();
});

// Start the test
restart();