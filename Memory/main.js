const gameboard = document.querySelector('.gameboard')
const buttons = document.getElementsByClassName('iconbtn')
const startBtn = document.querySelectorAll('.startbtn')
const startScreen = document.querySelector('.start')
const gameOverScreen = document.querySelector('.gameover')
const timeField = document.querySelector('.time')

const icons = [
	'<i class="fa-solid fa-heart"></i>',
	'<i class="fa-solid fa-ghost"></i>',
	'<i class="fa-solid fa-gamepad"></i>',
	'<i class="fa-solid fa-dragon"></i>',
	'<i class="fa-solid fa-dice"></i>',
	'<i class="fa-solid fa-skull-crossbones"></i>',
	'<i class="fa-solid fa-heart"></i>',
	'<i class="fa-solid fa-ghost"></i>',
	'<i class="fa-solid fa-gamepad"></i>',
	'<i class="fa-solid fa-dragon"></i>',
	'<i class="fa-solid fa-dice"></i>',
	'<i class="fa-solid fa-skull-crossbones"></i>',
]

const fields = 10
let a = null
let b = null
let mili = 0
let mili2 = 0 //  to count overall time
let time // Overall timer
let intervalOne = null
let intervalOverall = null
let i = 0 // Handle game over

const main = () => {
	shuffleIcons()
	fillGameboard()
	handleListeners()
}

const handleListeners = () => {
	const arrayButtons = Array.prototype.slice.call(buttons) // converts buttons node to array
	arrayButtons.forEach(button => button.addEventListener('click', handleClick))
}

const fillGameboard = () => {
	for (let i = 0; i < icons.length; i++) {
		const button = document.createElement('button')
		button.classList.add('iconbtn')
		button.innerHTML = icons[i]
		gameboard.appendChild(button)
	}
}

const shuffleIcons = () => {
	for (let i = icons.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		const old = icons[i]
		icons[i] = icons[j]
		icons[j] = old
	}
}

const checkEqueals = icon => {
	if (a != null) {
		b = icon
	} else {
		a = icon
		interval = setInterval(() => {
			countTime(a), 10
		})
	}

	if (a != null && b != null) {
		resetTimer()
		const arrayButtons = Array.prototype.slice.call(buttons)
		arrayButtons.forEach(button => (button.style.pointerEvents = 'none')) // block buttons 3 or more at once
		setTimeout(checkIfTheSame, 500)
	}
}

const blockTheSame = (a, b) => {
	let btn1 = a.closest('button')
	let btn2 = b.closest('button')
	btn1.style.pointerEvents = 'none'
	btn2.style.pointerEvents = 'none'
	checkWin()
}

const checkWin = () => {
	i++
	if (i == icons.length / 2) {
		gameOverScreen.style.display = 'flex'
		timeField.textContent = time
		clearInterval(intervalOverall)
		intervalOverall = null
		time = ""
		mili2 = 0
		// reseting game board
		gameboard.textContent = ""
		i = 0
		main()
	}
}

const checkIfTheSame = () => {
	aClass = a.classList[1]
	bClass = b.classList[1]
	const arrayButtons = Array.prototype.slice.call(buttons)
	arrayButtons.forEach(button => (button.style.pointerEvents = 'all')) // unblock buttons
	if (aClass != bClass) {
		let btn1 = a.closest('button')
		let btn2 = b.closest('button')
		btn1.classList.remove('button-rotate')
		btn2.classList.remove('button-rotate')
		a.classList.remove('fa-solid-show')
		b.classList.remove('fa-solid-show')
	} else {
		blockTheSame(a, b) // IF a == b block those buttons to prevent use it in the future
	}
	a = null
	b = null
}

const countTime = icon => {
	// Starting count time after clicking first button
	mili += 10
	let seconds = Math.floor((mili / 1000) % 60)
	if (seconds > 5) {
		let btn = icon.closest('button')
		btn.classList.remove('button-rotate')
		icon.classList.remove('fa-solid-show')
		resetTimer()
		a = null
	}
}

const handleClick = e => {
	let icon = e.target.firstChild
	e.target.classList.add('button-rotate')
	icon.classList.add('fa-solid-show')
	checkEqueals(icon)
}

const resetTimer = () => {
	clearInterval(interval)
	interval = null
	mili = 0
}

const handleHowLong = () => {
	// Function that counts time from start to end
	startScreen.style.display = 'none'
	gameOverScreen.style.display = 'none'
	mili2 += 10
	let minutes = Math.floor((mili2 / 60000) % 60)
	let seconds = Math.floor((mili2 / 1000) % 60)
	if (seconds < 10) {
		seconds = `0${seconds}`
	}
	time = `0${minutes}:${seconds}`
}

window.addEventListener('load', main)
startBtn.forEach(btn =>
	btn.addEventListener('click', () => {
		intervalOverall = setInterval(handleHowLong, 10)
	})
)
