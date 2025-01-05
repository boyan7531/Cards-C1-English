let currentWordIndex = 0;
let words = [];
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
        
        displayWord();
    } catch (error) {
        console.error('Error loading CSV:', error);
    }
}

function getRandomWord() {
    if (usedIndices.size === words.length) {
        usedIndices.clear(); // Reset when all words have been used
    }
    
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * words.length);
    } while (usedIndices.has(randomIndex));
    
    usedIndices.add(randomIndex);
    return randomIndex;
}

function displayWord() {
    if (words.length > 0) {
        const currentWord = words[currentWordIndex];
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

document.querySelector('.card').addEventListener('click', function() {
    this.classList.toggle('flipped');
});

document.getElementById('nextBtn').addEventListener('click', nextWord);

loadCSV();