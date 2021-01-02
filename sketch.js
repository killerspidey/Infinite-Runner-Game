var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_Running, mario_Collided;
var ground, invisibleGround, groundImg;
var bgImg;
var cloudsGroup, cloudImg;
var obstaclesGroup, ob1, ob2, ob3;

var score = 0;

var gameOver, restart;
var gameOverImg, restartImg;

localStorage["HighestScore"] = 0;

function preload() {
    mario_Running = loadAnimation("images/walk1.png", "images/walk2.png", "images/walk3.png");
    mario_Collided = loadAnimation("images/marioUp.png");
    
    groundImg = loadImage("images/ground.png");
    bgImg = loadImage("images/day.jpg");
    
    cloudImg = loadImage("images/cloud.png");
    
    ob1 = loadImage("images/pipe.png");
    ob2 = loadImage("images/flowerPipe.png");
    ob3 = loadImage("images/mushroom.png");
    
    gameOverImg = loadImage("images/gameOverText.png");
    restartImg = loadImage("images/restart.png");
}

function setup() {
    canvas = createCanvas(displayWidth - 20, displayHeight-120);
    
    mario = createSprite(100, 180, 20, 50);
    mario.addAnimation("running", mario_Running);
    mario.addAnimation("collided", mario_Collided);
    mario.scale = 0.55;
    
    ground = createSprite(200, 180, 700, 20);
    ground.addImage(groundImg);
    ground.x = ground.width /2;
    ground.velocityX = -(6 + 3 * score / 100);
    
    gameOver = createSprite(300, 50);
    gameOver.addImage(gameOverImg);
    gameOver.scale = 0.5;
    gameOver.visible = false;
    
    restart = createSprite(300, 140);
    restart.addImage(restartImg);
    restart.scale = 0.5;
    restart.visible = false;
    
    invisibleGround = createSprite(200, 190, 400, 10);
    invisibleGround.visible = false;
    
    cloudsGroup = new Group();
    obstaclesGroup = new Group();
    
    textSize(18);
    textFont("Georgia");
    textStyle(BOLD);
    fill("white");
    score = 0;
}

function draw() {
    camera.x = mario.x;
    camera.y = mario.y;
    
    gameOver.position.x = camera.x;
    restart.position.x = camera.x;
    
    background(bgImg);
    
    textAlign(RIGHT, TOP);
    text("Score: "+ score, 600, 5);
    
    if(gameState === PLAY) {
        score = score + Math.round(getFrameRate() / 60);
        ground.velocityX = -(6 + 3 * score / 100);
        
        if(keyDown("Space") && mario.y >= 159) {
            mario.velocityY = -12;
        }
        mario.velocityY += 0.8;
        
        if(ground.x < 0) {
            ground.x = ground.width / 3;
        }
        mario.collide(invisibleGround);
        spawnClouds();
        spawnObstacles();
        
        if(obstaclesGroup.isTouching(mario)) {
            gameState = END;
        }
    }
    else if(gameState === END) {
        gameOver.visible = true;
        restart.visible = true;
        
        ground.velocityX = 0;
        mario.velocityY = 0;
        
        obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);
        
        mario.changeAnimation("collided", mario_Collided);
        
        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);
        
        if(mousePressedOver(restart)) {
            reset();
        }
    }
    drawSprites();
}

function spawnClouds() {
    if(frameCount % 60 === 0) {
        var cloud = createSprite(600, 120, 40, 10);
        cloud.y = Math.round(random(80, 120));
        cloud.addImage(cloudImg);
        cloud.scale = 0.5;
        cloud.velocityX = -3;
        
        cloud.lifetime = 300;
        
        cloud.depth = mario.depth;
        mario.depth += 1;
        
        cloudsGroup.add(cloud);
    }
}

function spawnObstacles() {
    if(frameCount % 60 === 0) {
        var obstacle = createSprite(camera.x + width / 2, 165, 10, 40);
        obstacle.velocityX = -(6 + 3 * score / 100);
        
        var rand = Math.round(random(1, 3));
        switch(rand) {
            case 1 : obstacle.addImage(ob1);
                break;
            case 2 : obstacle.addImage(ob2);
                break;
            case 3 : obstacle.addImage(ob3);
                break;
                default : break;
        }
        obstacle.scale = 0.5;
        obstacle.lifetime = 300;
        obstaclesGroup.add(obstacle);
    }
}

function reset() {
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    
    mario.changeAnimation("running",mario_Running);
    
    if(localStorage["HighestScore"] < score){
        localStorage["HighestScore"] = score;
    }
    score = 0;
}