let player;
let playing

function setup() {
    
	new Canvas(800, 800);
	displayMode('centered');
	playing = true

	health = 100
	world.gravity.y = 8
	player = new Sprite(250,250,50,50,'d');

    
    enemy = new Sprite(450,450,50,50,'d');
    enemy2 = new Sprite(450,450,50,50,'d');
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

    player.overlaps(blood)

	player.overlapping(enemy, loseHealth)
    player.overlapping(enemy2, loseHealth)
    enemy.overlaps(enemy2)
    
}

function update(){

	if (playing == true){
        move()
        enemymove()
        HUD()
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
	
}

function enemymove(){
    enemy.rotation = enemy.angleTo(player)
			enemy.direction = enemy.rotation
			enemy.speed = 0.65
    enemy2.rotation = enemy2.angleTo(player)
			enemy2.direction = enemy2.rotation
			enemy2.speed = 2
}

function draw() {
	background('skyblue');
    HUD()
}


function loseHealth(player,enemy){
	health -=1
	let b = new blood.Sprite(player.x,player.y)
	b.vel.x = random(-1,1)
	b.vel.y = random(-1,1)

    if (health <= 0){
        health = 0
    }

}

function HUD(){
textSize(30)
text("HP: "+health,100,50)
}