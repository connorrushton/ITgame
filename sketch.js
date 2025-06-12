let player;
let playing;
let enemySpawnInterval;

function setup() {
    
	new Canvas(800, 800);
	displayMode('centered');
	playing = true

	health = 250
	score = 0
	world.gravity.y = 8
	player = new Sprite(250,250,50,60,'d');
	//player.image = playerImg
	

    
	enemies = new Group()
	enemies.color = 'red'
	enemies.w = 50
	enemies.h = 50
	enemy = new enemies.Sprite(100,100)
	enemy.image = alienImg
	enemy.enemyType = 'normal'

	drops = new Group()
	drops.color = 'white'
	drops.w = 50
	drops.h = 30
	dropcase = new drops.Sprite(100,100)



    blood = new Group()
	blood.radius = 2
	blood.color = 'yellow'
	blood.opacity = 0.5
	blood.life = 30
	blood.collider = 'n'

	floor = new Sprite(0,800,10000000000000,7,'s');
	floor.color = 'grey'

	floor.rotationLock = true;
    player.rotationLock = true;
    enemy.rotationLock = true;

	invisiblewallleft = new Sprite(-310,400,20,1000,'s');
	invisiblewallleft.rotationLock = true;
	invisiblewallleft.visible = false;

	invisiblewallright = new Sprite(1310,400,20,1000,'s');
	invisiblewallright.rotationLock = true;
	invisiblewallright.visible = false;


	bullets = new Group()
	bullets.color = 'black'
	bullets.w = 6
	bullets.h = 10
	bullets.image = bulletImg

    player.overlaps(blood)
	player.overlaps(bullets)

	player.overlapping(enemies, loseHealth)

	floor.overlaps(bullets)

	enemies.overlaps(enemies)
	enemies.overlaps(drops)

	
    
	// Start with initial spawn rate
	updateSpawnRate()
}

function preload(){
	alienImg = loadImage('alien.png')
	playerImg = loadImage('player.png')
	playerJetpackImg = loadImage('playerjetpack.png')
	bgImg = loadImage('bgImg.png')
	bulletImg = loadImage('hand_gun_bullet.png')
	alienImg2 = loadImage('alien2.png')
	alienImg3 = loadImage('alien3.png')
}

function update(){

	if (playing == true){
        move()
        enemymove()
        HUD()
		shoot()
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
		let fastEnemyChance = 0.05 + (score * 0.0025) // Base 30%, +1% per score point
		fastEnemyChance = Math.min(fastEnemyChance, 0.6) // Cap at 70%

		let bigEnemyChance = 0.3 + (score * 0.0075) // Base 30%, +1% per score point
		bigEnemyChance = Math.min(bigEnemyChance, 0.6) // Cap at 70%
		
		if(random() < bigEnemyChance){
			// Fast enemy properties
			newEnemy.enemyType = 'big'
			newEnemy.color = 'blue'
			newEnemy.w = 80 // Slightly smaller
			newEnemy.h = 80
			newEnemy.customSpeed = 0.25 // Faster movement
			newEnemy.image = alienImg2 // Use big enemy image
		} else if(random() < fastEnemyChance){
			// Fast enemy properties
			newEnemy.enemyType = 'fast'
			newEnemy.color = 'orange'
			newEnemy.w = 35 // Slightly smaller
			newEnemy.h = 35
			newEnemy.customSpeed = 5 // Faster movement
			newEnemy.image = alienImg3 // Use fast enemy image
		} else {
			// Regular enemy properties
			newEnemy.enemyType = 'normal'
			newEnemy.color = 'red'
			newEnemy.customSpeed = 1 // Normal speed
			newEnemy.image = alienImg // Use regular enemy image
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
		player.image = playerJetpackImg
		player.vel.y = -4
	}
	else if(kb.pressing('space')){
		player.vel.y = -4
	}
	else{
		player.image = playerImg
	}

	if(kb.pressing('l')){
		let oldScore = score
		score += 1
		
		// Update spawn rate when using cheat key too
		if (Math.floor(score / 5) > Math.floor(oldScore / 5)) {
			updateSpawnRate()
		}
	}

	player.rotateMinTo(mouse,10)
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
	background(bgImg);
    HUD()

	if (playing == true){
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
}

function loseHealth(p,e){
	health -=0.25
	let b = new blood.Sprite(p.x,p.y)
	b.vel.x = random(-1,1)
	b.vel.y = random(-1,1)

    if (health <= 0){
        health = 0
    }

	if (health > 250){
		health = 250
	}
}

function HUD(){
	fill(255, 0, 0)
    rect(50, 50, 200, 20) // Added fixed health bar background
	fill(0, 255, 0)
	rect(50, 50, 200 * (health / 250), 20) // Fixed health bar scaling
	textSize(30)
	fill(255)
	text("Score: "+score,250,25)


	// Debugging info
	textSize(16)
	text("Health: "+health,400,25)
	let currentRate = enemySpawnInterval ? (2000 - (score * 1)) : 3000
	currentRate = Math.max(currentRate, 200)
	text("Spawn Rate: " + currentRate + "ms", 250, 50)

	camera.x = player.x
	camera.y = player.y
	camera.zoom = 1.3
}