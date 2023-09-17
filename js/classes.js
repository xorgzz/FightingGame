class Sprite {
	constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
		this.position = position;
		this.width = 50;
		this.height = 150;
		this.image = new Image();
		this.image.src = imageSrc;
		this.scale = scale;
		this.framesMax = framesMax;
		this.framesCurrent = 0;
		this.framesElapsed = 0;
		this.framesHold = 5;
		this.offset = offset;
	}

	draw() {
		// context.fillRect(this.position.x, this.position.y, this.width, this.height) // Draw hit box
		context.drawImage(
			this.image,
			this.framesCurrent * (this.image.width / this.framesMax),
			0,
			this.image.width / this.framesMax,
			this.image.height,
			this.position.x - this.offset.x,
			this.position.y - this.offset.y,
			(this.image.width / this.framesMax) * this.scale,
			this.image.height * this.scale
		);
	}

	animateFrames() {
		this.framesElapsed++;

		if (this.framesElapsed % this.framesHold === 0) {
			if (this.framesCurrent < this.framesMax - 1) {
				this.framesCurrent++;
			} else {
				this.framesCurrent = 0;
			}
		}
	}

	update() {
		this.draw();
		this.animateFrames();
	}
}

class Fighter extends Sprite {
	constructor({ position, velocity, width, height, imageSrc, scale = 1, framesMax = 8, offset = { x: 0, y: 0 }, sprites, attackBox = { offset: {}, width: undefined, height: undefined }, attackVal }) {
		super({
			position,
			imageSrc,
			scale,
			framesMax,
			offset
		});

		this.velocity = velocity;
		this.width = width;
		this.height = height;
		this.lastKey;
		this.hp = 100;
		this.framesCurrent = 0;
		this.framesElapsed = 0;
		this.framesHold = 6;
		this.dead = false;
		this.attackVal = attackVal;

		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y
			},
			offset: attackBox.offset,
			width: attackBox.width,
			height: attackBox.height
		};

		this.sprites = sprites;
		
		for (const sprite in this.sprites) {
			sprites[sprite].image = new Image();
			sprites[sprite].image.src = sprites[sprite].imageSrc;
		} 

		this.isAttacking;
	}

// only 4 rectangle prototype
	// draw() {	// Function draws Sprite in this.pos.x & this.pos.y and 50px width & 150px height
	// 	context.fillStyle = this.color;
	// 	context.fillRect(this.position.x, this.position.y, 50, 150);

	// 	this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
	// 	this.attackBox.position.y = this.position.y;

	// 	// draw attack
	// 	if (this.isAttacking) {
	// 		context.fillStyle = 'grey';
	// 		context.fillRect(
	// 			this.attackBox.position.x,
	// 			this.attackBox.position.y,
	// 			this.attackBox.width,
	// 			this.attackBox.height
	// 		);
	// 	}
	// }

	update() {
		if (!this.dead) {
			this.draw();
			this.animateFrames();
		}
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
		this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
		// Draw attack box
		// context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);

		if (this.position.y + this.height + this.velocity.y >= canvas.height - 70) {
			this.velocity.y = 0;
			this.position.y = 376;
			// console.log(this.position.y);
		} else this.velocity.y += gravity;
		
	}

	attack() {
		this.switchSprite('attack');
		this.isAttacking = true;
		setTimeout(() => {
			this.isAttacking = false;
		}, attackTime);
	}

	switchSprite(sprite) {
		if (this.image === this.sprites.attack.image && this.framesCurrent < this.sprites.attack.framesMax - 1) return;
		if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1) return;
		if (this.image === this.sprites.die.image) {
			if (this.framesCurrent === this.sprites.die.framesMax)
				this.dead = true;
			return;
		}
		else if (this.dead) {
			return;
		}

		switch (sprite) {
			case 'idle':
				if (this.image !== this.sprites.idle.image) {
					this.image = this.sprites.idle.image;
					this.framesMax = this.sprites.idle.framesMax;
					this.framesCurrent = 0;
				}
				break;
		
			case 'run':
				if (this.image !== this.sprites.run.image){
					this.image = this.sprites.run.image;
					this.framesMax = this.sprites.run.framesMax;
					this.framesCurrent = 0;
				}
				break;

			case 'jump':
				if (this.image !== this.sprites.jump.image) {
					this.image = this.sprites.jump.image;
					this.framesMax = this.sprites.jump.framesMax;
					this.framesCurrent = 0;
				}
				break;
			
			case 'fall':
				if (this.image !== this.sprites.fall.image) {
					this.image = this.sprites.fall.image;
					this.framesMax = this.sprites.fall.framesMax;
					this.framesCurrent = 0;
				}
				break;

			case 'attack':
				if (this.image !== this.sprites.attack.image) {
					this.image = this.sprites.attack.image;
					this.framesMax = this.sprites.attack.framesMax;
					this.framesCurrent = 0;
				}
				break;

			case 'takeHit':
				if (this.image !== this.sprites.takeHit.image) {
					this.image = this.sprites.takeHit.image;
					this.framesMax = this.sprites.takeHit.framesMax;
					this.framesCurrent = 0;
				}
				break;

			case 'die':
				if (this.image !== this.sprites.die.image) {
					this.image = this.sprites.die.image;
					this.framesMax = this.sprites.die.framesMax;
					this.framesCurrent = 0;
				}
				break;

			default:
				break;
		}
	}
}