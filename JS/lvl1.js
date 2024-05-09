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
let projectileSpeed = 15;
let projectileDamage = 20;
let scoreMultiplier = 1;
let questions = [
    {
        question: `Given 𝑦=3𝑥+7, what is 𝑓(−2)?`,
        choice1: '1',
        choice2: '-1',
        choice3: '-13',
        choice4: '13',
        answer: 1,
    },
    {
        question: `What interest remains constant throughout the investment term?`,
        choice1: 'simple',
        choice2: 'compound',
        choice3: 'annuity due',
        choice4: 'ordinary annuity',
        answer: 1,
    },
    {
        question: `Which of the following terms define as a ratio of two polynomials?`,
        choice1: 'Rational expression ',
        choice2: 'Rational function ',
        choice3: 'Rational equation ',
        choice4: 'Rational inequality',
        answer: 1,
    },
    {
        question: 'The ___ of a relation is the set of all possible values that the variable x can take. ',
        choice1: 'function',
        choice2: 'range',
        choice3: 'equation',
        choice4: 'domain',
        answer: 4,
    }
]

const SCORE_POINTS = 100
const MAX_QUESTIONS = 4

startGame = () => {
    questionCounter = 0;
    score = 0;
    scoreText.innerText = score;
    availableQuestions = [...questions]
    getNewQuestion()
}
//question generation
function getNewQuestion() {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
      if (characterHP <= 0) {
        window.location.assign('/Html/end.html');
      } 
      else if (enemyHP > 0) {
        localStorage.setItem('mostRecentScore', score);
        localStorage.setItem('characterHP', characterHP);
        window.location.assign('/Html/yousurvive.html');
      }
      else {
        localStorage.setItem('mostRecentScore', score);
        localStorage.setItem('characterHP', characterHP); 
        window.location.assign('/Html/nextlevel.html');
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
    charHpBar.style.width = (characterHP / 100) * 100 + '%'
    enemyprojectile.style.display = 'none'
    hitAudio.play()
  }


//check correct or wrong
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
          incorrectAudio.play()
      }

        selectedChoice.parentElement.classList.add(classToApply)

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply)
            getNewQuestion()
        }, 1000)
    })
})

incrementScore = num => {
    score +=num
    scoreText.innerText = score
}


const audio = document.getElementById('game-audio');
        audio.addEventListener('timeupdate', () => {
            localStorage.setItem('audioPlaybackPosition', audio.currentTime);
        });

startGame()