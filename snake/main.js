class Snake {
	dx = -1
	dy = 0
	snake = []
	food = []
	wallSize = 10
	score = 0
	pauseGame = false

	init = () => {
		this.canvas = document.getElementById('canvas')
		this.context = this.canvas.getContext('2d')

		this.resetGame()
		this.startApp()
		this.handleListeners()
	}

	handleListeners = () => {
		document.addEventListener('keydown', e => {
			if (e.key == 'p') {
				this.pauseGame == true ? (this.pauseGame = false) : (this.pauseGame = true)
			}
			if (this.pauseGame) {
				return
			}
			if (e.key == 'ArrowUp' && this.dy == 0) {
				this.dx = 0
				this.dy = -10
			}
			if (e.key == 'ArrowDown' && this.dy == 0) {
				this.dx = 0
				this.dy = 10
			}
			if (e.key == 'ArrowLeft' && this.dx == 0) {
				this.dx = -10
				this.dy = 0
			}
			if (e.key == 'ArrowRight' && this.dx == 0) {
				this.dx = 10
				this.dy = 0
			}
		})
	}

	moveSnake = (dx, dy) => {
		let headX = this.snake[0].x + dx
		let headY = this.snake[0].y + dy
		this.snake.unshift({ x: headX, y: headY })
		this.snake.pop()
	}

	startApp = () => {
		setInterval(() => {
			this.clearScreen()
			if (!this.pauseGame) this.moveSnake(this.dx, this.dy)
			this.drawSnake()
			this.checkCollision()
			this.showInfo()
            this.showFood()
            this.eatFood()
		}, 100)
		setInterval(() => {
			if(!this.pauseGame) this.generateFood()
		},5000)
	}

	checkCollision = () => {
		if (
			this.snake[0].x == this.canvas.width ||
			this.snake[0].x <= 0 ||
			this.snake[0].y >= this.canvas.height ||
			this.snake[0].y <= 0
		) {
			this.resetGame()
		}
		for (let i = 1; i < this.snake.length; i++) {
			if (this.snake[0].x == this.snake[i].x && this.snake[0].y == this.snake[i].y) this.resetGame()
		}
	}

	clearScreen = () => {
		this.context.fillStyle = 'black'
		this.context.fillRect(0, 0, this.canvas.height, this.canvas.width)
	}

	makeSnake = snakeLength => {
		for (let i = 0; i < snakeLength; i++) {
			let x = this.canvas.width / 2 + i * this.wallSize // center of canvas
			let y = this.canvas.height / 2
			this.snake.push({ x: x, y: y })
		}
	}

	showInfo = () => {
		this.context.fillStyle = '#FFF'
		this.context.font = '20px Verdana'
		this.context.fillText(`Points: ${this.score}`, 10, 20)
		this.context.fillText('P to Pause', 290, 20)
	}

	drawSnake = () => {
		this.snake.forEach(el => {
			this.context.strokeStyle = 'red'
			this.context.lineWidth = 5
			this.context.lineJoin = 'bevel'
			this.context.strokeRect(el.x, el.y, this.wallSize, this.wallSize)
		})
	}

	generateFood = () => {
		let x = this.getRandom()
		let y = this.getRandom()
		this.food.push({ x: x, y: y })
	}

	showFood = () => {
		this.food.forEach(food => {
			this.drawRectRandomColor(food.x, food.y, 10, 10)
		})
	}

    eatFood = () => {
        this.food.forEach(food => {
            if(this.snake[0].x == food.x && this.snake[0].y == food.y) {
                let index = this.food.indexOf(food)
                this.food.splice(index, 1) // removes food from game board after eat
                this.snake.push({x:food.x, y:food.y}) // If snake eat food, he is getting bigger
                this.score++
            }
        })
    }

	resetGame = () => {
		this.snake = []
        this.food = []
		this.makeSnake(5)
		this.dx = -10
		this.dy = 0
        this.score = 0
	}

    getRandom = () => {
        return Math.floor(Math.random()* 35)*10+20 // got number that is divisible by 10, because snakes head position changes like 10, 20, 30... to match food position by x and y
    }

	getRandomInt = max => {
		return Math.floor(Math.random() * max)
	}

	drawRectRandomColor = (x, y, width, height) => {
		this.context.fillStyle = `rgb(${this.getRandomInt(255)}, ${this.getRandomInt(255)}, ${this.getRandomInt(255)})`
		this.context.fillRect(x, y, width, height)
	}

    
}

const snake = new Snake()

window.addEventListener('load', snake.init)
