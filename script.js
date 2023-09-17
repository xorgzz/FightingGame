const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const gravity = 0.7;
const moveSpeed = 5;
const jumpSpeed = 20;
const attackTime = 150;

// Defining canvas size 
canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);


const background = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: './img/background.png'
});

const player = new Fighter({
	position: { x: 50, y: 200 },
	velocity: { x: 0, y: 0 },
	width: 60,
	height: 130,
	imageSrc: './img/player1/Idle.png',
	framesMax: 8,
	scale: 2.4,
	offset: { x: 170, y: 120 },
	sprites: {
		idle: {
			imageSrc: './img/player1/Idle.png',
			framesMax: 8
		},
		run: {
			imageSrc: './img/player1/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './img/player1/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: './img/player1/Fall.png',
			framesMax: 2
		},
		attack: {
			imageSrc: './img/player1/Attack1.png',
			framesMax: 4
		},
		takeHit: {
			imageSrc: './img/player1/Take Hit.png',
			framesMax: 4
		},
		die: {
			imageSrc: './img/player1/Death.png',
			framesMax: 6
		}
	},
	attackBox: {
		offset: {
			x: 50,
			y: 45
		},
		width: 130,
		height: 50
	},
	attackVal: 20
});

const enemy = new Fighter({
	position: { x: 924, y: 200 },
	velocity: { x: 0, y: 0 },
	width: 55,
	height: 130,
	imageSrc: './img/player2/Idle.png',
	framesMax: 8,
	scale: (-1, 2.4),
	offset: { x: 205, y: 180 },
	sprites: {
		idle: {
			imageSrc: './img/player2/Idle.png',
			framesMax: 4
		},
		run: {
			imageSrc: './img/player2/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './img/player2/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: './img/player2/Fall.png',
			framesMax: 2
		},
		attack: {
			imageSrc: './img/player2/Attack2.png',
			framesMax: 4
		},
		takeHit: {
			imageSrc: './img/player2/Take Hit.png',
			framesMax: 3
		},
		die: {
			imageSrc: './img/player2/Death.png',
			framesMax: 7
		}
	},
	attackBox: {
		offset: {
			x: -160,
			y: 0
		},
		width: 140,
		height: 100
	},
	attackVal: 10
});


const keys = {
	// Player's keys
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	w: {
		pressed: false
	},

	// Enemie's keys 
	ArrowLeft: {
		pressed: false
	},
	ArrowRight: {
		pressed: false
	},
	ArrowUp: {
		pressed: false
	}
};


// Infinite loop made 2 animate objects in "The Game"
function main() {
	context.fillStyle = 'black';
	context.fillRect(0,0, canvas.width, canvas.height);
	window.requestAnimationFrame(main);
	
	background.update();
	player.update();
	enemy.update();

	player.velocity.x = 0;
	enemy.velocity.x = 0;

	// Player's movement

	if ( keys.a.pressed && player.lastKey === 'a' ) {
		player.velocity.x = moveSpeed * -1;
		player.switchSprite('run');
	}
	else if ( keys.d.pressed && player.lastKey === 'd' ) {
		player.velocity.x = moveSpeed;
		player.switchSprite('run');
	}
	else {
		player.switchSprite('idle');
	}

	if ( player.velocity.y < 0 ) {
		player.switchSprite('jump');
	} else if ( player.velocity.y > 0 ) {
		player.switchSprite('fall');
	}


	// Enemie's movement 

	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = moveSpeed * -1;
		enemy.switchSprite('run');

	}
	else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = moveSpeed;
		enemy.switchSprite('run');
	}
	else {
		enemy.switchSprite('idle');
	}

	if (enemy.velocity.y < 0) {
		enemy.switchSprite('jump');
	} else if (enemy.velocity.y > 0) {
		enemy.switchSprite('fall');
	}

	// Colision detection 4 player
	if ( colisionDetection(player, enemy) && player.isAttacking ) {
		player.isAttacking = false;
		enemy.hp -= player.attackVal;
		document.querySelector('#enemy_hp').style.width = `${enemy.hp}%`;
		if (enemy.hp <= 0) {
			enemy.switchSprite('die');
		}
		else {
			enemy.switchSprite('takeHit');
		}
		
	}
	
	// Colision detection 4 enemy
	if ( colisionDetection(enemy, player) && enemy.isAttacking ) {
		enemy.isAttacking = false;
		player.hp -= enemy.attackVal;
		document.querySelector('#player_hp').style.width = `${player.hp}%`;
		if (player.hp <= 0) {
			player.switchSprite('die');
		}
		else {
			player.switchSprite('takeHit');
		}
	}

	// Game end based on health 
	if (enemy.hp <= 0) {
		document.querySelector('#out').innerHTML = 'Player 1 wins!!';
		document.querySelector('#out').style.display = 'flex';
		clearTimeout(timerID);
	}
	if (player.hp <= 0) {
		player.switchSprite('die');
		document.querySelector('#out').innerHTML = 'Player 2 wins!!';
		document.querySelector('#out').style.display = 'flex';
		clearTimeout(timerID);
	}
}
main();

window.addEventListener('keydown', (event) => {
	if (!player.dead || !enemy.dead) {
		switch (event.key) {
			// Player's keys
			case 'd':
				keys.d.pressed = true;
				player.lastKey = 'd';
				break;
	
			case 'a':
				keys.a.pressed = true;
				player.lastKey = 'a';
				break;
	
			case 'w':
				keys.w.pressed = true;
				player.velocity.y = jumpSpeed * -1;
				break;
			
			case 's':
				player.attack();
				break;
			
			// Enemie's keys 
			case 'ArrowRight':
				keys.ArrowRight.pressed = true;
				enemy.lastKey = 'ArrowRight';
				break;
	
			case 'ArrowLeft':
				keys.ArrowLeft.pressed = true;
				enemy.lastKey = 'ArrowLeft';
				break;
	
			case 'ArrowUp':
				keys.ArrowUp.pressed = true;
				enemy.velocity.y = jumpSpeed * -1;
				break;
	
			case 'ArrowDown':
				enemy.attack();
				break;
	
			default:
				break;
		}
	}
});
window.addEventListener('keyup', (event) => {
	if (!player.dead || !enemy.dead) {
		switch (event.key) {
			// Player's keys
			case 'd':
				keys.d.pressed = false;
				break;
	
			case 'a':
				keys.a.pressed = false;
				break;
	
			case 'w':
				keys.w.pressed = false;
				break;
	
			// Enemie's keys 
			case 'ArrowRight':
				keys.ArrowRight.pressed = false;
				break;
	
			case 'ArrowLeft':
				keys.ArrowLeft.pressed = false;
				break;
	
			case 'ArrowUp':
				keys.ArrowUp.pressed = false;
				break;
	
			default:
				break;
		}
	}
});