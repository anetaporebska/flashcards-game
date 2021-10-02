const question = document.querySelector('#question');
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');
const progressBarFull = document.querySelector('#progressBarFull');

let currentQuestion = {};
let score = 0;
let questionIndex = -1;
let known = 0
let notKnown = 0
let multiplier = 1.0
let multiplierBonus = 0.01
let daysLevel = {
    0: 3,
    1: 7,
    2: 10,
    3: 25,
    4: 45,
    5: 60,
    6: 100,
    7: 150
}

let questions = []
let ans = false;

const SCORE_POINTS = 100;
let maxQuestionNumber = 0;
const MAX_LEVEL = 5;

async function getData(){
    const response = await fetch('/questions');
    questions = await response.json();
    maxQuestionNumber = questions.length
}

async function startGame(){
    score = 0;
    await getData();
    getNewQuestion();
}

async function getNewQuestion(){
    if (questionIndex == maxQuestionNumber - 1) {
        return await finishGame();
    }
    questionIndex++
    currentQuestion = questions[questionIndex]

    progressText.innerText = `Question ${questionIndex + 1} of ${maxQuestionNumber}`
    progressBarFull.style.width = `${((questionIndex + 1) / maxQuestionNumber) * 100}%`

    question.innerText = currentQuestion.question
    ans = false
}

async function finishGame() {
    saveStats();
    await new Promise(r => setTimeout(r, 500));
    localStorage.setItem("score", score);
    localStorage.setItem("known", known);
    localStorage.setItem("notKnown", notKnown);
    return window.location.assign('end.html');
}

function incrementScore(num){
    score += (num * multiplier)
    scoreText.innerText = score
}

function incrementDateAndLevel() {
    let newDate = new Date(currentQuestion.date)
    newDate.setDate(newDate.getDate() + daysLevel[currentQuestion.level])
    currentQuestion.date = newDate.getTime();
    currentQuestion.level++
}

function decrementLevel() {
    if (currentQuestion.level > 0) {
        currentQuestion.level--
    }
    currentQuestion.date = Date.now();
}


function showAnswer() {
    console.log('show')
    if (!ans) {
        question.innerText = currentQuestion.answer
        ans = true
    } else {
        question.innerText = currentQuestion.question
        ans = false
    }
}

async function saveStats(){
    console.log('Saving statistics');

    let stats = {
        known: known,
        notKnown: notKnown, 
        score: score
    }

    const options = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(stats)
    }
    await fetch('/score', options);
}

async function updateQuestion(){
    console.log('Updating question')
    const options = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentQuestion)
    }
    await fetch('/question', options);
}

function know() {
    incrementDateAndLevel()
    updateQuestion()
    known++
    multiplier += multiplierBonus
    incrementScore(SCORE_POINTS)
    getNewQuestion()
}

function notKnow() {
    decrementLevel()
    updateQuestion()
    notKnown++
    multiplier -= multiplierBonus
    getNewQuestion()
}

startGame()