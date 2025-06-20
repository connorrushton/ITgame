let player;
let playing;
let enemySpawnInterval;
let isSpeedBoosted = false;
let speedBoostEndTime = 0;
const speedboostduration = 5000;
const speedboostamount = 2;
let gameStarted = false;
let showInstructions = false;

function preload(){
    alienImg = loadImage('alien.png')
    playerImg = loadImage('player.png')
    playerJetpackImg = loadImage('playerjetpack.png')
    bgImg = loadImage('bgImg.png')
    bulletImg = loadImage('hand_gun_bullet.png')
    alienImg2 = loadImage('alien2.png')
    alienImg3 = loadImage('alien3.png')
}


function setup() {
    new Canvas(800, 800);
    displayMode('centered');
    playing = false;

    health = 250;
    score = 0;
    world.gravity.y = 8;
    
    player = new Sprite(250, 250, 50, 60, 'd');

    enemies = new Group();
    enemies.color = 'red';
    enemies.w = 50;
    enemies.h = 50;
    enemy = new enemies.Sprite(100, 100);
    enemy.image = alienImg;
    enemy.enemyType = 'normal';

    drops = new Group();
    drops.color = 'white';
    drops.w = 50;
    drops.h = 30;
    dropcase = new drops.Sprite(5000, 100);

    blood = new Group();
    blood.radius = 2;
    blood.color = 'yellow';
    blood.opacity = 0.5;
    blood.life = 30;
    blood.collider = 'n';

    floor = new Sprite(0, 800, 10000000000000, 7, 's');
    floor.color = 'grey';

    floor.rotationLock = true;
    player.rotationLock = true;
    enemy.rotationLock = true;

    invisiblewallleft = new Sprite(-310, 400, 20, 1000, 's');
    invisiblewallleft.rotationLock = true;
    invisiblewallleft.visible = false;

    invisiblewallright = new Sprite(1310, 400, 20, 1000, 's');
    invisiblewallright.rotationLock = true;
    invisiblewallright.visible = false;

    bullets = new Group();
    bullets.color = 'black';
    bullets.w = 6;
    bullets.h = 10;
    bullets.image = bulletImg;

    player.overlaps(blood);
    player.overlaps(bullets);

    player.overlapping(enemies, loseHealth);

    floor.overlaps(bullets);

    enemies.overlaps(enemies);
    enemies.overlaps(drops);

    updateSpawnRate();

    player.overlapping(drops, (p, drop) => {
        if (drop.type === 'health') {
            health = min(health + 25, 250);
        } else if (drop.type === 'speed') {
            isSpeedBoosted = true;
            speedBoostEndTime = millis() + speedboostduration;
        }
        drop.remove();
    });
}

function update(){
    if (playing == true){
        move();
        enemymove();
        HUD();
        shoot();
        if (isSpeedBoosted && millis() > speedBoostEndTime) {
            isSpeedBoosted = false;
        }
    }
    else if (playing == false){
        enemymove();
        if (enemySpawnInterval) {
            clearInterval(enemySpawnInterval);
            enemySpawnInterval = null;
        }
    }
    else{
        console.log('ERROR, PLAYING FAILED');
    }
    if(health <= 0){
        playing = false;
    }
}

function updateSpawnRate(){
    if (enemySpawnInterval) {
        clearInterval(enemySpawnInterval);
    }
    
    let baseRate = 2000;
    let reductionPerPoint = 1;
    let minimumRate = 200;
    
    let newRate = Math.max(baseRate - (score * reductionPerPoint), minimumRate);
    
    enemySpawnInterval = setInterval(spawnEnemy, newRate);
    
    console.log(`Score: ${score}, New spawn rate: ${newRate}ms`);
}

function drawMenu() {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(50);
    text("ALIENS VS HUMANS", 400, 200);
    
    textSize(20);
    text("Press SPACE to Play", 400, 350);
    text("Press I for Instructions", 400, 380);
    text("Press ESC to Exit", 400, 410);
}

function drawInstructions() {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(30);
    text("INSTRUCTIONS", 400, 100);
    
    textAlign(LEFT, TOP);
    textSize(16);
    text("WASD - Move", 100, 200);
    text("Mouse - Aim and Shoot", 100, 220);
    text("Space/W Key - Jetpack", 100, 240);
    text("Collect green drops for health!", 100, 280);
    text("Collect blue drops for speed boost!", 100, 300);
    text("Green aliens - Normal", 100, 340);
    text("Orange aliens - Fast and Small", 100, 360);
    text("Blue aliens - Tough and Big", 100, 380);
    
    textAlign(CENTER, CENTER);
    textSize(20);
    text("Press B to go Back", 400, 500);
}

function keyPressed() {
    if (!gameStarted) {
        if (key === ' ') {
            gameStarted = true;
            playing = true;
            updateSpawnRate();
        } else if (key == 'i') {
            showInstructions = true;
        }
    } else if ((key == 'x')) {
            showInstructions = false;
        }
    }



function spawnEnemy(){
    if(playing){
        let newEnemy = new enemies.Sprite(random(width), random(height));
        
        let fastEnemyChance = 0.05 + (score * 0.0025);
        fastEnemyChance = Math.min(fastEnemyChance, 0.6);

        let bigEnemyChance = 0.3 + (score * 0.0075);
        bigEnemyChance = Math.min(bigEnemyChance, 0.6);
        
        if(random() < bigEnemyChance){
            newEnemy.enemyType = 'big';
            newEnemy.color = 'blue';
            newEnemy.w = 80;
            newEnemy.h = 80;
            newEnemy.customSpeed = 0.25;
            newEnemy.image = alienImg2;
            newEnemy.hits = 0;
        } else if(random() < fastEnemyChance){
            newEnemy.enemyType = 'fast';
            newEnemy.color = 'orange';
            newEnemy.w = 35;
            newEnemy.h = 35;
            newEnemy.customSpeed = 5;
            newEnemy.image = alienImg3;
        } else {
            newEnemy.enemyType = 'normal';
            newEnemy.color = 'red';
            newEnemy.customSpeed = 1;
            newEnemy.image = alienImg;
        }
    }
}

function move(){
    let baseSpeed = 2;
    let currentSpeed = isSpeedBoosted ? baseSpeed + speedboostamount : baseSpeed;

    if (kb.pressing('a')) {
        player.vel.x = -currentSpeed;
    } else if (kb.pressing('d')) {
        player.vel.x = currentSpeed;
    } else {
        player.vel.x = 0;
    }
    
    if(kb.pressing('w')){
        player.image = playerJetpackImg;
        player.vel.y = -4;
    }
    else if(kb.pressing('space')){
        player.vel.y = -4;
    }
    else{
        player.image = playerImg;
    }

    if(kb.pressing('l')){
        score += 1;
        
        if (Math.floor(score / 5) > Math.floor((score - 1) / 5)) {
            updateSpawnRate();
        }
    }

    player.rotateMinTo(mouse, 10);
}

function shoot(){
    if(playing){
        if(mouse.released()){
            let b = new bullets.Sprite(player.x, player.y);
            b.direction = b.angleTo(mouse);
            b.rotation = b.direction;
            b.speed = 30;
        }
    }
}

function enemymove(){
    if(playing){
        for(let e of enemies){
            e.rotation = e.angleTo(player);
            e.direction = e.rotation;
            
            if (e.enemyType == 'fast'){
                e.speed = e.customSpeed || 5;
            } else if (e.enemyType == 'big'){
                e.speed = e.customSpeed || 0.25;
            } else {
                e.speed = e.customSpeed || 1;
            }
        }
    }
}

function draw() {
    background(bgImg);

    if (!gameStarted) {
        if (showInstructions) {
            drawInstructions();
        } else {
            drawMenu();
        }
        return;
    }
    
    if (playing == true){
        for (let b of bullets){
            for (let e of enemies){
                if (b.collides(e)) {
                    b.remove();
                    
                    if (e.enemyType === 'big') {
                        e.hits++;
                        if (e.hits < 2) {
                            break;
                        }
                    }
                    
                    e.remove();
                    score += 1;

                    if (random() < 0.10) {
                        spawnDrop(e.x, e.y);
                    }

                    if (Math.floor(score / 5) > Math.floor((score - 1) / 5)) {
                        updateSpawnRate();
                    }
                    break;
                }
            }
        }
    }
    
    HUD();
}

function loseHealth(p, e){
    health -= 0.25;
    let b = new blood.Sprite(p.x, p.y);
    b.vel.x = random(-1, 1);
    b.vel.y = random(-1, 1);

    if (health <= 0){
        health = 0;
    }

    if (health > 250){
        health = 250;
    }
}

function HUD(){
    fill(255, 0, 0);
    rect(50, 50, 200, 20);
    fill(0, 255, 0);
    rect(50, 50, 200 * (health / 250), 20);
    
    textSize(30);
    fill(255);
    text("Score: " + score, 250, 25);

    textSize(16);
    text("Health: " + health, 400, 25);
    let currentRate = 2000 - (score * 1);
    currentRate = Math.max(currentRate, 200);
    text("Spawn Rate: " + currentRate + "ms", 250, 50);

    if (isSpeedBoosted) {
        fill(0, 255, 255);
        text("SPEED BOOST!", 600, 25);
    }

    camera.x = player.x;
    camera.y = player.y;
    camera.zoom = 1.3;
}

function spawnDrop(x, y) {
    let drop = new drops.Sprite(x, y);
    drop.type = random() < 0.5 ? 'health' : 'speed';
    drop.life = 300;

    if (drop.type === 'health') {
        drop.color = 'green';
    } else {
        drop.color = 'blue';
    }
}