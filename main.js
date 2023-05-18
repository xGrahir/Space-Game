class Quiz {
	numQuestion = 0

	init = async () => {
		this.quizul = document.querySelector('.quiz-answers')
		this.quest = document.querySelector('.question')
		this.radioButtons = document.getElementsByTagName('input')
        this.labels = document.getElementsByTagName('label')
		this.timeCounter = document.querySelector('.time')
		this.nextBtn = document.querySelector('.next-btn')
        this.restartBtn = document.querySelector('.btn-restart')
        this.questionCounter = document.querySelector('.counter')
		this.error = document.querySelector('.error')
        this.listOfQA = document.querySelector('.list-of-qa')
        this.finalList = document.querySelector('.show-answers')
    
		await this.loadData()
		this.fillQuestion()
        this.whichQuestion() // on which question you are
		this.handleListeners()
		this.countTime()
	}

	handleListeners = () => {
		this.nextBtn.addEventListener('click', this.nextQuestion)
        this.restartBtn.addEventListener('click', this.restartQuiz)
        for(let i=0; i<this.labels.length; i++) {
            this.labels[i].addEventListener('click', this.saveAnswerToVar)
        }
	}

	loadData = async () => {
		let data = await fetch('questions.json')
		let parseddata = await data.json()

		if (!parseddata) {
			console.log('Brak pytań')
			return
		}

		this.maxTime = parseddata.maxtime * 1000
		this.questions = parseddata.questions
	}

    restartQuiz = () => {
        this.numQuestion = 0
        this.finalList.style.display = "none"
        this.restartBtn.style.display = "none"
        this.nextBtn.style.display = "block"
        this.fillQuestion()
        this.whichQuestion()
	this.countTime()
        this.handleListeners()
        this.listOfQA.innerHTML = ''
	this.quizul.style.pointerEvents = "all"
	this.quizul.style.opacity = 1
    }

	fillQuestion = () => {
		this.quizul.innerHTML = ''
		this.quest.innerHTML = this.questions[this.numQuestion].question
		this.answers = this.questions[this.numQuestion].answers
        // Fill the answers
		for (let i = 0; i < this.answers.length; i++) {
			this.createElements()
			this.setAttributes(i)
			this.li.appendChild(this.input)
			this.li.appendChild(this.label)
			this.quizul.appendChild(this.li)
			this.label.textContent = this.answers[`${i}`]
		}
	}

	createElements = () => {
		this.li = document.createElement('li')
		this.label = document.createElement('label')
		this.input = document.createElement('input')
	}

	setAttributes = i => {
		this.input.setAttribute('type', 'radio')
		this.input.setAttribute('name', 'answer')
		this.input.setAttribute('id', `${i}`)
		this.label.setAttribute('for', `${i}`)
	}

	countTime = () => {
		if (!this.interval) {
			this.timeNow = new Date().getTime()
			this.endTime = this.timeNow + this.maxTime
			this.interval = setInterval(() => {
				const currentTime = new Date().getTime()
				if (currentTime >= this.endTime) {
					this.stopTime()
					this.fillList()
                    this.showAnswers()
					return
				}
				let timeLeft = Math.floor((this.endTime - currentTime) / 1000)
				this.timeCounter.textContent = `Pozostało ${timeLeft} sekund`
			}, 1000)
		}
	}

    whichQuestion = () => {
        this.questionCounter.innerHTML = `Pytanie ${this.numQuestion+1} z ${this.questions.length}`
    }

	stopTime = () => {
		if (this.interval) {
			clearInterval(this.interval)
			this.interval = null
		}
	}

	checkChoice = () => {
		let check = 3

		for (let i = 0; i < this.radioButtons.length; i++) {
			if (!this.radioButtons[i].checked) {
				check--
			}
		}

		if (check == 0) {
			this.error.style.display = 'block'
			return false
		} else if (check == 1) {
			this.error.style.display = 'none'
			return true
		}
	}

    fillList = () => {
        this.indexOfAns = null // Set to null in case end of time
        for(let i = this.numQuestion; i<this.questions.length; i++) {
            this.createListOfQA()
            this.numQuestion++
        }
    }

    createListOfQA = () => {
        let ul = document.createElement('ul')
        ul.classList.add('answers')
        let h2 = document.createElement('h2')
        h2.textContent = this.questions[this.numQuestion].question
        h2.setAttribute('id', `${this.numQuestion}`)
        ul.appendChild(h2)
        for(let i=0; i<this.answers.length; i++) {
            let li = document.createElement('li')
            li.textContent = this.questions[this.numQuestion].answers[i] // instead of this.answers[i] to good fill after time's end
            ul.append(li)
            this.checkAnswer(li, i)
        }
        
        this.listOfQA.appendChild(ul)
    }

    saveAnswerToVar = (e) => {
        this.indexOfAns = this.questions[this.numQuestion].answers.indexOf(`${e.target.textContent}`) // Get index of your answer from json
    }

    checkAnswer = (li, i) => {
        if (this.indexOfAns+1 == this.questions[this.numQuestion].correct && i == this.indexOfAns) { //Add 1 to indexOfAns because indexes start from 0
            li.classList.add('good')
        } else if (this.indexOfAns+1 != this.questions[this.numQuestion].correct && i == this.indexOfAns) {
            li.classList.add('bad')
        }
    }

    saveAnswer = () => {
        this.createListOfQA()
    }

    showAnswers = () => {
        this.finalList.style.display = "flex"
        this.restartBtn.style.display = "block"
        this.nextBtn.style.display = "none"
		this.quizul.style.opacity = 0
		this.quizul.style.pointerEvents = "none"
    }

	nextQuestion = () => {
		if (this.checkChoice()) {
            this.saveAnswer()
			this.numQuestion++
			if (this.numQuestion >= this.questions.length) {
				this.showAnswers()
				return
			}
            this.whichQuestion()
			this.fillQuestion()
            this.handleListeners()
		} else {
            return
        }
	}
}

let quiz = new Quiz()

window.addEventListener('load', quiz.init)
