var GAME_WIDTH = 720;
var GAME_HEIGHT = 400;
var GAME_SCALE = 2.25;
// var HORIZON_Y = GAME_HEIGHT/GAME_SCALE/2;

var gameport = document.getElementById("gameport");
var renderer = new PIXI.autoDetectRenderer(GAME_WIDTH,
                                           GAME_HEIGHT,
                                           {backgroundColor: 0x99D5FF});

gameport.appendChild(renderer.view);

var stage = new PIXI.Container();

// Scene objects get loaded in the ready function
var playerUp, playerDown, playerRight, playerLeft;
var world;
var bool;

//add start screen to scene graph
var start_screen = new PIXI.Container();
stage.addChild(start_screen);

//background for start
var start_screen_bg = new PIXI.Sprite(
  PIXI.Texture.fromImage("title_screen.png") );

//button to enter game
var start_screen_button = new PIXI.Sprite(
  PIXI.Texture.fromImage("play_button.png") );

//add start button to start
start_screen_bg.addChild(start_screen_button);
start_screen_button.position.x = 30;
start_screen_button.position.y = 325;

//add start screen background to start screen
start_screen.addChild(start_screen_bg);

//functon to switch screen when start button is clicked on
function mouseStartHandler(e)
{
  stage.removeChild(start_screen);
  stage.addChild(world);

  //set scale for game to zoom in
  stage.scale.x = GAME_SCALE;
  stage.scale.y = GAME_SCALE;

  //boolean to update camera set to true
  bool = true;
}


//call mousehandler when screen clicked on
start_screen_button.interactive = true;
start_screen_button.on('mousedown', mouseStartHandler);

function gameloop() {
        movePlayer();
}


// movePlayer function makes smoother movement
function movePlayer() {
        // top wall
      if(playerUp && player.position.y > 112) {
          player.position.y -= 2;
      }
        // bottom wall
      if(playerDown && player.position.y < 1136) {
          player.position.y += 2;
      }
        // left wall
      if(playerLeft && player.position.x > 112) {
          player.position.x -= 2;
      }
        // right wall
      if(playerRight && player.position.x < 1136) {
          player.position.x += 2;
      }
}


var enemyProjectileSpeed = 1.5;

// Function: moveEnemy()
// Desc: Move enemy slightly closer to the player
function moveEnemy() {
  enemy.rotation -= 0.02;

  // move the enemy right
  if(enemy.position.x < player.position.x) {
    enemy.position.x = enemy.position.x + 1 * enemyProjectileSpeed;
  }
  // move the enemy left
  else if(enemy.position.x > player.position.x) {
    enemy.position.x = enemy.position.x - 1 * enemyProjectileSpeed;
  }
  // move the enemy down
  if(enemy.position.y < player.position.y) {
    enemy.position.y = enemy.position.y + 1 * enemyProjectileSpeed;
  }
  // move the enemy up
  else if(enemy.position.y > player.position.y) {
    enemy.position.y = enemy.position.y - 1 * enemyProjectileSpeed;
  }
} 

//Collision Detection & monster following player movement

function collisionDetection(first, second) {
  var firstBounds = first.getBounds();
  var secondBounds = second.getBounds();

  return firstBounds.x + firstBounds.width > secondBounds.x
      && firstBounds.x < secondBounds.x + secondBounds.width 
      && firstBounds.y + firstBounds.height > secondBounds.y
      && firstBounds.y < secondBounds.y + secondBounds.height;
}


// Check if enemy hit the player, if so game over. Change enemy speed
//@param {
  // Function: checkForEnemyHit(first, second)
// Desc: Check for a collision between the player and the enemy
function checkForEnemyHit(first, second)
{
  if(collisionDetection(first, second))
  {
    stage = END_SCREEN;
    deathSound.play();
    endGame();
  }
  incrementProjectileSpeed();
}

function checkForItemCollect(first, second)
{
  if ( collisionDetection( first, second) )
  {
    updateScore();
  }
}

// Function: incrementEnemySpeed()
// Desc: Increases the enemy speed by 0.1
function incrementProjectileSpeed()
{
  if(enemySpeed <= 2)
  {
    enemySpeed = enemySpeed + 0.1;
  }
}  


var treasure_Score = 0;
/* This breaks the game [NEEDS FIX]

treasureScoreText = new PIXI.Text("Treasures: " + treasure_Score, gameScoreStyle);
treasureScoreText.position.x = 30;
treasureScoreText.position.y = 30;

*/

//Increases score by one each time Astro finds treasure
function updateScore()
{
  
    score += 1
    treasureScoreText.text = "Treasures: " + gameScore;

    if(score == 3)
    {
      stage = END_SCREEN;
      cheerSound.play();
      endGame();
    }
  
}






// keydown handler booleans for button presses for moving player
function keydownEventHandler(e) {
    // key movement for player up, down, left, right
  if (e.keyCode == 87) { // W key
    playerUp = true;
  }
  if (e.keyCode == 83) { // S key
    playerDown = true;
  }
  if (e.keyCode == 65) { // A key
    playerLeft = true;
  }
  if (e.keyCode == 68) { // D key
    playerRight = true;
  }
}

// key up handlers for player not moving
function keyupEventHandler(e) {
  if (e.keyCode == 87) { // W key
    playerUp = false;
  }
  if (e.keyCode == 83) { // S key
    playerDown = false;
  }
  if (e.keyCode == 65) { // A key
    playerLeft = false;
  }
  if (e.keyCode == 68) { // D key
    playerRight = false;
  }
}

// event listeners for key press and key up
document.addEventListener('keydown', keydownEventHandler);
document.addEventListener('keyup', keyupEventHandler);

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

PIXI.loader
  .add('map_json', 'map.json')
  .add('map', 'map.png')
  .add('assets.json')
  .load(ready);

function ready() {
  var tu = new TileUtilities(PIXI);
  world = tu.makeTiledWorld("map_json", "map.png");

  // create frames for character sprite
  var frames = [];
  for( var i = 1; i <=3; i++)
  {
    frames.push(PIXI.Texture.fromFrame("astro" + i + ".png"));
  }

  player = new PIXI.extras.MovieClip(frames);
  player.animationSpeed = .1;

  // orient player
  player.scale.set(0.1, 0.1);
  player.position.x = 350;
  player.position.y = 200;

  player.play();

  var entity_layer = world.getObject("GameObjects");
  entity_layer.addChild(player);

  animate();
  update();

  // boolean to stop update camera
  bool = false;
}

// function to animate player and move camera
function animate(timestamp) {
  requestAnimationFrame(animate);
  update_camera();
  renderer.render(stage);
}

// update function to control player movement in game loop
function update(){
    setInterval(gameloop, 20);
}

function update_camera() {
    // conditional to prevent updating camera on start screen
  if( bool )
  {
    stage.x = -player.x*GAME_SCALE + GAME_WIDTH/2 - player.width/2*GAME_SCALE;
    stage.y = -player.y*GAME_SCALE + GAME_HEIGHT/2 + player.height/2*GAME_SCALE;
    stage.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - GAME_WIDTH, -stage.x));
    stage.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - GAME_HEIGHT, -stage.y));
  }
}
