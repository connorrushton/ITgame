let player;
let playing

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


    

	if (score > 100){
		setInterval(spawnEnemy,0)
	}
	else{
		setInterval(spawnEnemy,2000)
	}	
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
					score += 1
				}
			}
		}
    }
    else if (playing == false){
        enemymove()
    }
    else{
        console.log('ERROR, PLAYING FAILED')
    }
    if(health <= 0){
			playing = false
			
		}
	}


function spawnEnemy(){
	if(playing){
		new enemies.Sprite(random(width),random(height))
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
		score += 1
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
rect(50, 50, 200 * (health / 100), 20)
textSize(30)
fill(255)
//text("HP: "+health,100,25)
text("Score: "+score,250,25)
}