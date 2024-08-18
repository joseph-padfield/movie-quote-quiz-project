const timeBoxElem = document.querySelector('.timeBox')
const instructionsButtonElem = document.querySelector('.instructionsButton')
const instructionsModalElem = document.querySelector('.modalContainer')
const modalCloseButtonElem = document.querySelector('.closeButton')
const startGameButtonElem = document.querySelector('.startGameButton')
const scoreBoxElem = document.querySelector('.scoreBox')
const displayQuoteElem = document.querySelector('.displayQuote')
const playerChoicesElem = document.querySelector('.playerChoices')
const finalScoreElem = document.querySelector('.finalScore')
const gameOverModalElem = document.querySelector('.gameOverModal')
const playAgainButtonElem = document.querySelector('.playAgainButton')
let films = []
let totalScore = 0

instructionsButtonElem.addEventListener('click', () => {
    instructionsModalElem.showModal()
})
modalCloseButtonElem.addEventListener('click', () => {
    instructionsModalElem.close()
})
startGameButtonElem.addEventListener('click', () => {
    runGame()
    startGameButtonElem.style.display = 'none'
    timeBoxElem.style.visibility = 'visible'
    scoreBoxElem.style.visibility = 'visible'
})
playAgainButtonElem.addEventListener('click', () => {
    resetGame()
})

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}

const getFilms = (() => {
    return fetch('quotes.json')
        .then((response) => {
            return response.json()
        })
        .then((filmsList) => {
            return filmsList['films']
        })
})

const startGame = (() => {
    getFilms()
        .then((filmsList) => {
            films = filmsList
        })
})

const playRound = (() => {
    films = shuffleArray(films)
    const answer = films.pop()
    hint = answer['year']
    const choices = shuffleArray([answer['title'], films[0]['title'], films[1]['title']])
    const quote = document.createElement('p')
    quote.textContent = answer['quote']
    displayQuoteElem.append(quote)
    choices.forEach((item) => {
        const choice = document.createElement('button')
        choice.classList.add('choice')
        choice.textContent = item
        choice.addEventListener('click', () => {
            if (item === answer['title']) {
                choice.style.backgroundColor = 'green'
                score()
            }
            else {
                choice.style.backgroundColor = 'red'
            }
            setTimeout(clearContainer, 500, displayQuoteElem)
            setTimeout(clearContainer, 500, playerChoicesElem)
            setTimeout(playRound, 500)
        })
        playerChoicesElem.append(choice)
    })
    const hintButtonElem = document.createElement('button')
    hintButtonElem.classList.add('hintButton')
    hintButtonElem.textContent = 'Hint'
    hintButtonElem.addEventListener('click', () => {
        hintButtonElem.textContent = answer['year']
    })
    playerChoicesElem.append(hintButtonElem)
})

const clearContainer = (container) => {
    container.textContent = ''
}

const runGame = () => {
    playRound()
    runTimer()
}

const score = (() => {
    totalScore ++
    scoreBoxElem.textContent = totalScore
    if (totalScore % 5 === 0) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: {y: .6}
        })
    }
})

const runTimer = (() => {
    let time = 30
    const timer = setInterval(() => {
        if (time > 0) {
            time --
            timeBoxElem.textContent = String(time)
        }
        else {
            clearInterval(timer)
            gameFinish()
        }
    }, 1000)
})

const gameFinish = () => {
    finalScoreElem.textContent = `Your score: ${totalScore}`
    gameOverModalElem.showModal()
}

const resetGame = () => {
    clearContainer(displayQuoteElem)
    clearContainer(playerChoicesElem)
    totalScore = 0
    timeBoxElem.textContent = '30'
    scoreBoxElem.textContent = totalScore
    startGame()
    gameOverModalElem.close()
    runGame()
}

startGame()



