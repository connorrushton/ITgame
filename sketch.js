let player;
let playing

function setup() {
    playing = false
    health = 100
    
	new Canvas(500, 500);
	displayMode('centered');
	world.gravity.y = 8
	player = new Sprite(250,250,50,50,'d');
    enemy = new Sprite(350,350,50,50,'d');
    blood = new Group()
	blood.radius = 2
	blood.color = 'red'
	blood.opacity = 0.5
	blood.life = 30
	blood.collider = 'n'
	square3 = new Sprite(0,500,10000000000000,1,'s');
	square3.rotationLock = true;
    player.rotationLock = true;
    enemy.rotationLock = true;

    player.overlaps(blood)

	player.overlapping(enemy, loseHealth)
    
}

function update(){

	if (playing = true){
        move()
        enemymove()
        HUD()
    }
    else if (playing = false){
        player.hide()
    }
    else{
        console.log('ERROR, PLAYING FAILED')
    }
    if(health <= 0){
			playing=false
			
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
	else if(kb.pressing('s')){
		player.vel.y = 2
	}
	
}

function enemymove(){
    enemy.rotation = enemy.angleTo(player)
			enemy.direction = enemy.rotation
			enemy.speed = 0.65
}

function draw() {
	background('skyblue');
    if (playing = true){
        move()
        enemymove()
    }
    else if (playing = false){
        player.hide()
        console.log('Game ended')
    }
    else{
        console.log('ERROR, PLAYING FAILED')
    }
}


function loseHealth(player,enemy){
	health -=1
	let b = new blood.Sprite(player.x,player.y)
	b.vel.x = random(-1,1)
	b.vel.y = random(-1,1)

}

function HUD(){

	textSize(30)
	camera.off()
    
    fill(255, 0, 0)
    rect(50, 50, 200, 20)
    
    fill(0, 255, 0)
    rect(50, 50, 200 * (health / 100), 20)
    
    textSize(30)
    fill(255)
    text("HP: " + floor(health), 260, 70)
    
    camera.on()

}