var GAME_WIDTH = 720;
var GAME_HEIGHT = 400;
var GAME_SCALE = 4;
var DIM = 16;

var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(GAME_WIDTH, GAME_HEIGHT, {backgroundColor: 0x3079f0});

gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.scale.x = GAME_SCALE;
stage.scale.y = GAME_SCALE;

// Scene objects get loaded in the ready function
var hero;
var world;
var water;
var lava;

// Character movement constants:
var MOVE_LEFT = 1;
var MOVE_RIGHT = 2;
var MOVE_UP = 3;
var MOVE_DOWN = 4;
var MOVE_NONE = 0;

// The move function starts or continues movement
// The move function starts or continues movement
function move() {

  if (hero.direction == MOVE_NONE) {
    hero.moving = false;
    return;
  }

  var dx = 0;
  var dy = 0;

  if (hero.direction == MOVE_LEFT) dx -= 1;
  if (hero.direction == MOVE_RIGHT) dx += 1;
  if (hero.direction == MOVE_UP) dy -= 1;
  if (hero.direction == MOVE_DOWN) dy += 1;

  if (water[(hero.gy+dy-1)*12 + (hero.gx+dx)] != 0) {
    hero.moving = false;
    return;
  }
  if (lava[(hero.gy+dy-1)*12 + (hero.gx+dx)] != 0) {
    hero.moving = false;
    return;
  }

  hero.gx += dx;
  hero.gy += dy;

  hero.moving = true;

  createjs.Tween.get(hero).to({x: hero.gx*DIM, y: hero.gy*DIM}, 250).call(move);

}

// Keydown events start movement
window.addEventListener("keydown", function (e) {
  e.preventDefault();
  if (!hero) return;
  if (hero.moving) return;
  if (e.repeat == true) return;

  hero.direction = MOVE_NONE;

  if (e.keyCode == 87)
    hero.direction = MOVE_UP;
  else if (e.keyCode == 83)
    hero.direction = MOVE_DOWN;
  else if (e.keyCode == 65)
    hero.direction = MOVE_LEFT;
  else if (e.keyCode == 68)
    hero.direction = MOVE_RIGHT;

  move();
});

// Keyup events end movement
window.addEventListener("keyup", function onKeyUp(e) {
  e.preventDefault();
  if (!hero) return;
  hero.direction = MOVE_NONE;
});

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

PIXI.loader
  .add('map.json')
  .add('map2.png')
  .add('hero.png')
  .load(ready);

function ready() {
  createjs.Ticker.setFPS(60);
  var tu = new TileUtilities(PIXI);
  world = tu.makeTiledWorld("map.json", "tileset.png");
  stage.addChild(world);

  hero = new PIXI.Sprite(PIXI.loader.resources["hero.png"].texture);
  hero.gx = 9;
  hero.gy = 5;
  hero.x = hero.gx*DIM;
  hero.y = hero.gy*DIM;
  hero.anchor.x = 0.0;
  hero.anchor.y = 1.0;

  // Find the entity layer
  var entities = world.getObject("Entities");
  entities.addChild(hero);

  // get wate object
  water = world.getObject("water").data;
  // get lava object
  lava = world.getObject("lava").data;

  hero.direction = MOVE_NONE;
  hero.moving = false;
  animate();
}

function animate(timestamp) {
  requestAnimationFrame(animate);
  update_camera();
  renderer.render(stage);
}

// updates scaled down view of camera, pixels will move in and out of screen
function update_camera() {
  stage.x = -hero.x*GAME_SCALE + GAME_WIDTH/2 - hero.width/2*GAME_SCALE;
  stage.y = -hero.y*GAME_SCALE + GAME_HEIGHT/2 + hero.height/2*GAME_SCALE;
  stage.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - GAME_WIDTH, -stage.x));
  stage.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - GAME_HEIGHT, -stage.y));
}



// //code from Dr Palmer
// PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
//
// //Creating sprites
// //backgrounds
// var start_screen_bg = new PIXI.Sprite(
//   PIXI.Texture.fromImage("startScreen.png") );
//
// //buttons to navigate menu
// var start_screen_button = new PIXI.Sprite(
//   PIXI.Texture.fromImage("startButton.png") );
//
// //backgrounds for game level
// var background = new PIXI.Sprite(
//   PIXI.Texture.fromImage("background.png") );
//
// //add start screen to scene graph
// var start_screen = new PIXI.Container();
// start_screen.position.x = 200;
// start_screen.position.y = 200;
// stage.addChild(start_screen);
//
// //add start screen background to start screen
// start_screen.addChild(start_screen_bg);
// start_screen_bg.position.x = -200;
// start_screen_bg.position.y = -200;
//
// //start button to go to game1
// start_screen_bg.addChild(start_screen_button);
// start_screen_button.position.x = 30;
// start_screen_button.position.y = 325;
