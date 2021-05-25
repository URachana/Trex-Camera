var PLAY = 1;
var END = 0;
var gameState = PLAY;

var bgImg;
var sun, sunImg;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var jump, collide;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

localStorage = ["HighestScore"];
localStorage[0] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png", "trex2.png", "trex3.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  sunImg = loadImage("sun.png");
  
  bgImg = loadImage("backgroundImg.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  
  jump = loadSound("jump.wav");
  collide = loadSound("collided.wav");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(windowWidth-90,10,10,10);
  sun.addImage(sunImg);
  sun.scale = 0.15;
  
  trex = createSprite(50,windowHeight-90,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.15;
  
  trex.setCollider("circle", 50, 0, 200);
  
  ground = createSprite(windowWidth/2,windowHeight+30,windowWidth,10);
  ground.addImage("ground",groundImage);
  ground.x = width/2
 // ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(windowWidth/2,windowHeight/2 - 20);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth/2,windowHeight/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 1;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(windowWidth/2, windowHeight-50,width, 10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  window.focus();
}

function draw() {
  //trex.debug = true;
  background(bgImg);
  fill("black")
  textSize(20);
  textFont("Comic Sans MS");
  text("Score: "+ score, camera.position.x + width/2 -200, height/10 +10);
  text("HI: "+ localStorage[0],  camera.position.x + width/2 -300, height/10 +10);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    //ground.velocityX = -(6 + 3*score/100);
    
    camera.position.x = trex.x;
     trex.velocityX += 0.05;
  
    if((keyDown("SPACE")) && trex.y  >= 340) {
      jump.play( )
      trex.velocityY = -10;
      
    }
  
    trex.velocityY = trex.velocityY + 0.6
  
    /*if (ground.x < 0){
      ground.x = ground.width/2;
    }*/
    
    if(camera.position.x + width/2 > width/2 + ground.x){
        ground.x = camera.position.x;
       invisibleGround.x = camera.position.x;
    }
    
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        collide.play();
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
     gameOver.x = camera.position.x;
   restart.x = camera.position.x;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  ground.depth = trex.depth;
  trex.depth = trex.depth + 1;
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
    var cloud = createSprite(camera.position.x+ width/2,100,40,10);
    cloud.y = Math.round(random(40,100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    //cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = gameOver.depth;
    gameOver.depth = gameOver.depth + 1;
    
    cloud.depth = sun.depth;
    sun.depth = sun.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(camera.position.x + width/2,405,10,40);
    //obstacle.debug = true;
    //obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale = (0.2);
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale = (0.1);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    
    obstacle.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
 
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage[0]<score){
    localStorage[0] = score;
  }
  console.log(localStorage[0]);
  
  score = 0;
  
}