class Space {
	score = 0
	lifes = 3
	// Player's starting coordinates
	posX = 400
	posY = 520

	dx = 0 // actual speed of player's move

	bulletSpeed = 10 // players bullet speed
	alienBulletSpeed = 5

	aliensCount = 0 // number of aliens
	numberOfAliens = 20 // Set how much aliens on screen
	alienPosX = 5 // Position of the first target from the left
	alienPosY = 50
	ammo = []
	aliens = []
	alienBullets = []

	init = () => {
		this.canvas = document.getElementById('canvas')
		this.context = this.canvas.getContext('2d')

		this.spaceBg = new Image()
		this.spaceBg.src = 'images/space.jpg'

		this.spaceShip = new Image()
		this.spaceShip.src = 'images/spaceship3.png'

		this.bullet = new Image()
		this.bullet.src = 'images/laserBullet.png'

		this.alien = new Image()
		this.alien.src = 'images/alien.png'

		this.alienBullet = new Image()
		this.alienBullet.src = 'images/alienshoot.png'

		this.shootSound = new Audio()
		this.shootSound.src = 'sounds/shoot.mp3'

		this.enemyShootSound = new Audio()
		this.enemyShootSound.src = "sounds/enemyshoot.wav"

		this.lostSound = new Audio()
		this.lostSound.src = "sounds/lostgame.mp3"

		this.btns = document.querySelectorAll('button')
		
		this.handleListeners()
		this.startApp()
	}

	handleListeners = () => {
		document.addEventListener('keydown', this.keyDownEvents)
		document.addEventListener('keyup', this.keyUpEvents)
		// this.btns.forEach(btn => btn.addEventListener('click', this.keyDownEvents))
	}

	keyDownEvents = e => {
		if (e.key == 'ArrowRight') {
			this.dx = 5
		}

		if (e.key == 'ArrowLeft') {
			this.dx = -5
		}

		if (e.key == 'ArrowUp' || e.key == ' ') {
			this.generateAmmo()
		}

		if (e.key == "r" && this.inteval == null) {
			this.lifes = 0
			this.gameOver()
			this.startApp()
		}

	}

	keyUpEvents = () => {
		this.dx = 0
	}

	checkCollision = () => {
		if (this.posX > this.canvas.width - this.spaceShip.width) {
			this.posX = this.canvas.width - this.spaceShip.width
		}

		if (this.posX < 0) {
			this.posX = 0
		}

		// Check your bullets with enemy ships
		this.enemyCollisionCheck()

		// Check enemy bullets with your ship
		this.yourCollisionCheck()
	}

	enemyCollisionCheck = () => {
		if (this.ammo.length > 0) {
			if (this.ammo[0].y < -10) {
				this.ammo.pop()
			} else {
				for (let i = 0; i < this.aliens.length; i++) {
					if (
						// if your bullet shoots an enemy
						this.ammo[0].y <= this.aliens[i].y + this.aliens[i].height &&
						this.ammo[0].y >= this.aliens[i].y - this.aliens[i].height &&
						this.ammo[0].x > this.aliens[i].x - this.aliens[i].width / 2 &&
						this.ammo[0].x < this.aliens[i].x + this.aliens[i].width
					) {
						let index = this.aliens.indexOf(this.aliens[i])
						this.aliens.splice(index, 1)
						this.ammo.pop()
						this.score++
						break
					}
				}
			}
		}
	}

	yourCollisionCheck = () => {
		if (this.alienBullets.length > 0) {
			if (this.alienBullets[0].y > this.canvas.height) {
				this.alienBullets.pop()
			} else {
				if (
					// if enemy's bullet shoot you
					this.alienBullets[0].y >= this.posY - this.spaceShip.height / 3 &&
					this.alienBullets[0].x >= this.posX - this.spaceShip.width &&
					this.alienBullets[0].x <= this.posX + this.spaceShip.width
				) {
					this.alienBullets.pop()
					this.lifes--
				}
			}
		}
	}

	shipMove = () => {
		this.posX += this.dx
	}

	generateAmmo = () => {
		if (this.ammo.length == 0) {
			let x = this.posX + this.spaceShip.width / 5
			let y = this.posY - this.spaceShip.height / 2
			this.ammo.push({ x: x, y: y })
			this.shootSound.play()
		}
	}

	handleShot = () => {
		if (this.ammo.length != 0) {
			this.context.drawImage(this.bullet, this.ammo[0].x, this.ammo[0].y)
			this.ammo[0].y -= this.bulletSpeed
		}
	}

	generateAliens = () => {
		while (this.aliensCount < this.numberOfAliens) {
			this.aliens.push({
				img: this.alien,
				x: this.alienPosX,
				y: this.alienPosY,
				width: this.alien.width,
				height: this.alien.height,
			})
			this.alienPosX += 80
			if (this.alienPosX > this.canvas.width) { // 725
				this.alienPosX = 5
				this.alienPosY += 80 // new row
			}
			this.aliensCount++
		}
	}

	showAliens = () => {
		this.aliens.forEach(alien => {
			this.context.drawImage(alien.img, alien.x, alien.y)
		})
	}

	randomAlienBulletGenerate = () => {
		if(this.aliens.length > 0) {
			let i = Math.floor(Math.random() * this.aliens.length)
			let alien = this.aliens[i]
			let x = alien.x
			let y = alien.y + alien.height / 2
			this.alienBullets.push({ img: this.alienBullet, x: x, y: y })
			this.enemyShootSound.play()
		}
	}

	randomAlienBulletShoot = () => {
		if (this.alienBullets.length > 0) {
			this.context.drawImage(this.alienBullets[0].img, this.alienBullets[0].x, this.alienBullets[0].y)
			this.alienBullets[0].y += this.alienBulletSpeed
		}
	}

	showInfo = () => {
		this.context.fillStyle = '#FFF'
		this.context.font = '20px Verdana'
		this.context.fillText(`Points: ${this.score}`, 10, 20)
		this.context.fillText(`Lifes: ${this.lifes}`, 720, 20 )
	}

	gameOver = () => {
		if(this.lifes == 0) {
			this.lostSound.play()
			this.posX = 400
			this.posY = 520
			this.alienPosX = 5
			this.alienPosY = 50
			this.aliens = []
			this.alienBullets = []
			this.ammo = []
			this.aliensCount = 0
			this.lifes = 3
			this.score = 0
		}
	}

	gameWin = () => {
		if(this.aliens.length == 0) {
			this.context.fillStyle = '#FFF'
			this.context.font = '40px Verdana'
			this.context.fillText("YOU WIN", 300, 250)
			this.context.fillText("Press 'R' to play again", 200, 350)
			clearInterval(this.interval)
			clearInterval(this.alienInterval)
			this.interval == null
			this.alienInterval == null
		}
	}

	startApp = () => {
		this.interval = setInterval(() => {
			this.render()
			this.shipMove()
			this.handleShot()
			this.checkCollision()
			this.generateAliens()
			this.showAliens()
			this.showInfo()
			this.randomAlienBulletShoot()
			this.gameWin()
			this.gameOver()
		}, 1000 / 60)
		this.alienInterval = setInterval(() => {
			this.randomAlienBulletGenerate()
		}, 5000)
	}

	render = () => {
		this.context.drawImage(this.spaceBg, 0, 0)
		this.context.drawImage(this.spaceShip, this.posX, this.posY)
	}
}

const space = new Space()

window.addEventListener('load', space.init)
