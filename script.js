let currentWordIndex = 0;
let words = [];
let activeWords = [];
let usedIndices = new Set();

async function loadCSV() {
    try {
        const response = await fetch('words.csv');
        const data = await response.text();
        const rows = data.split('\n').slice(1); // Skip header row
        
        words = rows.map(row => {
            const [word, meaning, sentence] = row.split(',').map(item => item.trim());
            return { word, meaning, sentence };
        });
    } catch (error) {
        console.error('Error loading CSV:', error);
    }
}

function setWordCount(count) {
    // Get the last n words from the full list
    activeWords = words.slice(-count);
    usedIndices.clear();
    
    // Update UI
    document.querySelectorAll('.count-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-count="${count}"]`).classList.add('active');
    document.getElementById('nextBtn').disabled = false;
    
    // Start with first word
    nextWord();
}

function getRandomWord() {
    if (usedIndices.size === activeWords.length) {
        usedIndices.clear();
    }
    
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * activeWords.length);
    } while (usedIndices.has(randomIndex));
    
    usedIndices.add(randomIndex);
    return randomIndex;
}

function displayWord() {
    if (activeWords.length > 0) {
        const currentWord = activeWords[currentWordIndex];
        document.getElementById('word').textContent = currentWord.word;
        document.getElementById('meaning').textContent = currentWord.meaning;
        document.getElementById('sentence').textContent = currentWord.sentence;
    }
}

function nextWord() {
    currentWordIndex = getRandomWord();
    displayWord();
    document.querySelector('.card').classList.remove('flipped');
}

// Event Listeners
document.querySelector('.card').addEventListener('click', function() {
    this.classList.toggle('flipped');
});

document.getElementById('nextBtn').addEventListener('click', nextWord);

document.querySelectorAll('.count-btn').forEach(button => {
    button.addEventListener('click', () => {
        const count = parseInt(button.dataset.count);
        setWordCount(count);
    });
});

// Load CSV when page loads
loadCSV();