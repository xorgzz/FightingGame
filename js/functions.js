let time = 60, timerID;


function colisionDetection(var1, var2) {
	return (
		var1.attackBox.position.x + var1.attackBox.width >= var2.position.x
		&& var1.attackBox.position.x < var2.position.x + var2.width
		&& var1.attackBox.position.y + var1.attackBox.height >= var2.position.y
		&& var1.attackBox.position.y <= var2.position.y + var2.height
	);
}

function timer() {
	timerID = setTimeout(timer, 1000);
	if (time > 0) {
		time--;
		document.querySelector('#timer').innerHTML = time;
	}
	if (time === 0) {
		if (player.hp === enemy.hp) document.querySelector('#out').innerHTML = 'Tie';
		else if (player.hp > enemy.hp) document.querySelector('#out').innerHTML = 'Player 1 wins!!';
		else if (player.hp < enemy.hp) document.querySelector('#out').innerHTML = 'Player 2 wins!!';
		document.querySelector('#out').style.display = 'flex';
		clearTimeout(timerID);
	}
}
timer();

