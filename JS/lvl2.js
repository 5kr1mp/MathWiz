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
        question: `To divide two fractions or rational expressions, multiply the dividend with the ________ of the divisor.`,
        choice1: 'reciprocal',
        choice2: 'addend',
        choice3: 'abscissa',
        choice4: 'Theorem',
        answer: 1,
    },
    {
        question: `Rational function can be represented by the following EXCEPT.`,
        choice1: 'Table of values',
        choice2: 'Equation',
        choice3: 'Graph',
        choice4: 'Picture',
        answer: 4,
    },
    {
        question: `Which of the following set of ordered pairs is NOT a function?`,
        choice1: '(1,2),(2,3),(3,4),(4,5)',
        choice2: '(1,2),(1,3),(3,6),(4,8)',
        choice3: '(1, 1), (2, 2), (3, 3), (4, 4)',
        choice4: '(3, 2), (4, 2), (5, 2), (6, 2)',
        answer: 2,
    },
    {
        question: 'It refers to an interest that is computed based on the principal and interest accumulated every conversion period.',
        choice1: 'simple ',
        choice2: 'compound ',
        choice3: 'annuity due ',
        choice4: 'ordinary annuity',
        answer: 2,
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
        window.location.assign('end.html');
      } 
      else if (enemyHP > 0) {
        localStorage.setItem('mostRecentScore', score);
        localStorage.setItem('characterHP', characterHP);
        window.location.assign('yousurvive(2).html');
      }
      else {
        localStorage.setItem('mostRecentScore', score);
        localStorage.setItem('characterHP', characterHP); 
        window.location.assign('nextlevel(2).html');
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
      window.location.assign('end.html');
    }
  }



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