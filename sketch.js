let player;
let playing;
let enemySpawnInterval; // Store the interval ID

function setup() {
    
	new Canvas(800, 800);
	displayMode('centered');
	playing = true

	health = 250
	score = 0
	world.gravity.y = 8
	player = new Sprite(250,250,50,50,'d');
	

    
	enemies = new Group()
	enemies.color = 'red'
	enemies.w = 50
	enemies.h = 50
	enemy = new enemies.Sprite(100,100)
    blood = new Group()
	blood.radius = 2
	blood.color = 'red'
	blood.opacity = 0.5
	blood.life = 30
	blood.collider = 'n'
	square3 = new Sprite(0,800,10000000000000,1,'s');
	square3.rotationLock = true;
    player.rotationLock = true;
    enemy.rotationLock = true;
	bullets = new Group()
	bullets.color = 'black'
	bullets.w = 6
	bullets.h = 10

    player.overlaps(blood)

	player.overlapping(enemies, loseHealth)

	player.overlaps(bullets)

	square3.overlaps(bullets)
    
	// Start with initial spawn rate
	updateSpawnRate()
}

function update(){

	if (playing == true){
        move()
        enemymove()
        HUD()
		shoot()
		for (b of bullets){
			for (e of enemies){
				if (b.collides(e)){
					b.remove()
					e.remove()
					let oldScore = score
					score += 1
					
					// Update spawn rate when score increases significantly
					if (Math.floor(score / 5) > Math.floor(oldScore / 5)) {
						updateSpawnRate()
					}
				}
			}
		}
    }
    else if (playing == false){
        enemymove()
		// Stop spawning when game over
		if (enemySpawnInterval) {
			clearInterval(enemySpawnInterval)
			enemySpawnInterval = null
		}
    }
    else{
        console.log('ERROR, PLAYING FAILED')
    }
    if(health <= 0){
		playing = false
	}
}

function updateSpawnRate(){
	// Clear existing interval
	if (enemySpawnInterval) {
		clearInterval(enemySpawnInterval)
	}
	
	// Calculate new spawn rate based on score
	// Base rate: 1000ms, decreases as score increases
	// Minimum rate: 200ms (very fast spawning)
	let baseRate = 2000
	let reductionPerPoint = 1 // Reduce by 15ms per score point
	let minimumRate = 200
	
	let newRate = Math.max(baseRate - (score * reductionPerPoint), minimumRate)
	
	// Set new interval
	enemySpawnInterval = setInterval(spawnEnemy, newRate)
	
	console.log(`Score: ${score}, New spawn rate: ${newRate}ms`)
}

function spawnEnemy(){
	if(playing){
		let newEnemy = new enemies.Sprite(random(width),random(height))
		
		// 30% chance to spawn a fast enemy (increases with score)
		let fastEnemyChance = 0.1 + (score * 0.01) // Base 30%, +1% per score point
		fastEnemyChance = Math.min(fastEnemyChance, 0.4) // Cap at 70%
		
		if(random() < fastEnemyChance){
			// Fast enemy properties
			newEnemy.enemyType = 'fast'
			newEnemy.color = 'orange'
			newEnemy.w = 40 // Slightly smaller
			newEnemy.h = 40
			newEnemy.customSpeed = 5 // Faster movement
		} else {
			// Regular enemy properties
			newEnemy.enemyType = 'normal'
			newEnemy.color = 'red'
			newEnemy.customSpeed = 1 // Normal speed
		}
	}
}

function move(){
    if(kb.pressing('a')){
	 	player.vel.x = -2
	 }
	 else if(kb.pressing('d')){
		player.vel.x = 2
	}
	else{
		player.vel.x = 0
	}
	 if(kb.pressing('w')){
		player.vel.y = -4
	}
	else if(kb.pressing('space')){
		player.vel.y = -4
	}

	if(kb.pressing('l')){
		let oldScore = score
		score += 1
		
		// Update spawn rate when using cheat key too
		if (Math.floor(score / 5) > Math.floor(oldScore / 5)) {
			updateSpawnRate()
		}
	}

	player.rotateMinTo(mouse,100)
}

function shoot(){
	if(playing){
		if(mouse.released()){
			let b = new bullets.Sprite(player.x,player.y)
			b.direction = b.angleTo(mouse)
			b.rotation = b.direction
			b.speed = 30
		}
	}
}

function enemymove(){
    if(playing){
		for(e of enemies){
			e.rotation = e.angleTo(player)
			e.direction = e.rotation
			e.speed = 1
		}
		if (enemies.length > 0){
			for(e of enemies){
				if (e.enemyType == 'fast'){
					e.speed = e.customSpeed
				}
				else{
					e.speed = 1
				}
			}
		}
	}
}

function draw() {
	background('skyblue');
    HUD()
}

function loseHealth(p,e){
	health -=0.25
	let b = new blood.Sprite(p.x,p.y)
	b.vel.x = random(-1,1)
	b.vel.y = random(-1,1)

    if (health <= 0){
        health = 0
    }
}

function HUD(){
	fill(0, 255, 0)
	rect(50, 50, 200 * (health / 250), 20) // Fixed health bar scaling
	textSize(30)
	fill(255)
	text("Score: "+score,250,25)
	
	// Show current spawn rate for debugging
	textSize(16)
	let currentRate = enemySpawnInterval ? (2000 - (score * 1)) : 3000
	currentRate = Math.max(currentRate, 200)
	text("Spawn Rate: " + currentRate + "ms", 250, 50)
}