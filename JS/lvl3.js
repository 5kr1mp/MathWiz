const question = document.querySelector('#question')
const choices = Array.from(document.querySelectorAll('.choice-text'))
const progressText = document.querySelector('#progressText')
const scoreText = document.querySelector('#score')
const progressBarFull = document.querySelector('#progressBarFull')
const characterElement = document.getElementById('character')
const enemy = document.getElementById('enemy')
const char = document.getElementById('character')
const enemyprojectile = document.getElementById('enemy-projectile')
const charprojectile = document.getElementById('char-projectile')
const enemyHpBar = document.getElementById('enemyhp-bar')
const charHpBar = document.getElementById('charhp-bar')
const correctAudio = new Audio('/SoundEfcts/correct.mp3');
const incorrectAudio = new Audio('/SoundEfcts/incorrect.mp3');
const hitAudio = new Audio('/SoundEfcts/hit.mp3');

let characterHP = 100
let currentQuestion = {}
let acceptingAnswers = true
let score = 0
let questionCounter = 0
let availableQuestions = []
let enemyHP = 80;
let projectileSpeed = 10;
let projectileDamage = 20;
let scoreMultiplier = 1;
let questions = [
    {
        question: `It is a set of ordered pairs (𝑥,𝑦) such that no two ordered pairs have the same x-value but different y-values?`,
        choice1: 'relation',
        choice2: 'function',
        choice3: 'domain',
        choice4: 'range',
        answer: 2,
    },
    {
        question: `It is the amount after t years that the lender will receive from the borrower.`,
        choice1: 'future Value',
        choice2: 'present Value',
        choice3: 'interest',
        choice4: 'principal',
        answer: 1,
    },
    {
        question: `The simple interest formula is I = Prt.  What does the t represent?`,
        choice1: 'principle',
        choice2: 'time',
        choice3: 'interest',
        choice4: 'percent rate',
        answer: 2,
    },
    {
        question: 'The vertical line x=a is a _________________of a function f if the graph of either increases or decreases without bound as the x-values approach a from the right to left.',
        choice1: 'horizontal asymptote',
        choice2: 'hole',
        choice3: 'vertical asymptote',
        choice4: 'x-intercept',
        answer: 3,
    }
]

const SCORE_POINTS = 100
const MAX_QUESTIONS = 4

startGame = () => {
    questionCounter = 0;
        characterHP = localStorage.getItem('characterHP') ? parseInt(localStorage.getItem('characterHP')) : 100;
        charHpBar.style.width = `${characterHP}%`
    score = localStorage.getItem('mostRecentScore')? parseInt(localStorage.getItem('mostRecentScore')) : 0;
    scoreText.innerText = score;
    availableQuestions = [...questions]
    getNewQuestion()
}

function getNewQuestion() {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
      if (characterHP <= 0) {
        window.location.assign('/Html/end.html');
      } 
      else { 
        localStorage.setItem('mostRecentScore', score);
        localStorage.setItem('characterHP', characterHP); 
        window.location.assign('/Html/end.html');
      }
    }
    questionCounter++
    progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`
    progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}%`

    const questionsIndex = Math.floor(Math.random() * availableQuestions.length)
    currentQuestion = availableQuestions[questionsIndex]
    question.innerText = currentQuestion.question
    
    choices.forEach(choice => {
        const number = choice.dataset.number
        choice.innerText = currentQuestion['choice' +  number]
    })

    availableQuestions.splice(questionsIndex, 1)

    acceptingAnswers = true
}
//character
function charThrowProjectile() {
    charprojectile.style.top = characterElement.offsetTop + 'px';
    charprojectile.style.left = characterElement.offsetLeft + 'px';
    charprojectile.style.display = 'block';
    let intervalId = setInterval(() => {
      charprojectile.style.left = parseInt(charprojectile.style.left) + projectileSpeed + 'px';
      if (checkEnemyCollision()) {
        clearInterval(intervalId);
        dealEnemyDamage();
      }
    }, 16);
  }
  
  function checkEnemyCollision() {
    const projectileRect = charprojectile.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();
    return (
      projectileRect.left <= enemyRect.right &&
      projectileRect.right >= enemyRect.left &&
      projectileRect.top <= enemyRect.bottom &&
      projectileRect.bottom >= enemyRect.top
    );
  }
  
  function dealEnemyDamage() {
    enemyHP -= projectileDamage;
    enemyHpBar.style.width = (enemyHP / 100) * 100 + '%';
    charprojectile.style.display = 'none'
    hitAudio.play();
  }
  //enemy
  function enemyThrowProjectile() {
    enemyprojectile.style.top = characterElement.offsetTop + 'px';
    enemyprojectile.style.right = characterElement.offsetLeft + 'px';
    enemyprojectile.style.display = 'block';
    let intervalId = setInterval(() => {
      enemyprojectile.style.right = parseInt(enemyprojectile.style.right) + projectileSpeed + 'px';
      if (checkCharCollision()) {
        clearInterval(intervalId);
        dealCharDamage();
      }
    }, 16);
  }
  
  function checkCharCollision() {
    const projectileRect = enemyprojectile.getBoundingClientRect();
    const charRect = char.getBoundingClientRect();
    return (
      projectileRect.left <= charRect.right &&
      projectileRect.right >= charRect.left &&
      projectileRect.top <= charRect.bottom &&
      projectileRect.bottom >= charRect.top
    );
  }
  
  function dealCharDamage() {
    characterHP -= projectileDamage;
    charHpBar.style.width = (characterHP / 100) * 100 + '%';
    enemyprojectile.style.display = 'none'
    hitAudio.play();
    if (characterHP <= 0) {
      window.location.assign('/Html/end.html');
    } 
  }
//identifier
choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return

        acceptingAnswers = false
        const selectedChoice = e.target
        const selectedAnswer = selectedChoice.dataset.number

        let classToApply = selectedAnswer == currentQuestion.answer ? 'correct': 'incorrect'

        if(classToApply === 'correct') {
          incrementScore(SCORE_POINTS)
          scoreMultiplier++
          charThrowProjectile()
          correctAudio.play()
        }else {
          scoreMultiplier = 1
          enemyThrowProjectile()
          incorrectAudio.play()
        }

        selectedChoice.parentElement.classList.add(classToApply)

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply)
            getNewQuestion()
        }, 1500)
    })
})

incrementScore = num => {
    score +=num
    scoreText.innerText = score
}
const audio = document.getElementById('game-audio');
const storedPosition = localStorage.getItem('audioPlaybackPosition');
if (storedPosition) {
    audio.currentTime = storedPosition;
}
startGame()