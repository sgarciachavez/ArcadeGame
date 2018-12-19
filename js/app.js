//
// Enemies our player must avoid
var Enemy = function(x,y,speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.speed = speed;
    this.x = x;
    this.y = y;
    this.sprite = 'images/enemy-bug.png';
    this.crash = new sound('sound/NFF-wrong-move.wav');
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //console.log(`dt = ${dt}`);
    this.x = this.x + (this.speed * dt);
    //Check for Collision -- Using the Pythagorean theorem!!!
    //var dx = (player.x > this.x) ? player.x - this.x : this.x - player.x;
    //var dy = (player.y > this.y) ? player.y - this.y : this.y - player.y;
    var dx = player.x - this.x;
    var dy = player.y - this.y;
    var distance = Math.sqrt((dx * dx) + (dy * dy));
    if(distance < 75 && player.y > -5){ //a CRASH has occured!!!
      //reset Player
      player.x = 200;
      player.y = 400;
      this.crash.play();
      counter.addCrash();
      crashes.textContent = counter.crashes;
    }
};

Enemy.prototype.reset = function(){
  if(this.x > 501){
    this.x = -100;
    //Assign new speed
    this.speed = Math.floor((Math.random() * 250) + 10);
  }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
/**
 * @description class Player
 * @param {constructor} sprite, x, y
 * This Player object can be moved and detect when it was won by getting across to the other side
 */
class Player{
  constructor(sprite, x, y){
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.won = new sound('sound/NFF-carillon-02-a.wav');
    this.jump = new sound('sound/NFF-zing.wav');
    this.iswinner = false;
  }

  //add methods here
  update(){

  }
  move(i, value){
    if(value > -20 && value < 420){
      if(i === "x"){
        this.x = value;
      }else{
        this.y = value;
      }
      this.jump.play();
      counter.addMove();
      moves.textContent = counter.moves;
    }
  }

  handleInput(keyCode){

    if(keyCode === "up"){
      this.move("y", this.y - 15);  //decrease the y value
    }
    if(keyCode === "down"){
      this.move("y", this.y + 15);  //increase the y value
    }

    if(keyCode === "right"){
      this.move("x", this.x + 15); //increase the x value
    }
    if(keyCode === "left"){
      this.move("x", this.x - 15);  //decrease the x value
    }
    //We have a WINNER!
    if(this.y === -5 && this.iswinner === false){
       this.iswinner = true;
       this.won.play();
       endMoves.textContent = counter.moves;
       endCrashes.textContent = counter.crashes;
       popup.classList.toggle("hide", false);
    }
  }
  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}
/**
 * @description class Counter
 * @param {constructor} moves, crashes
 * This Counter object contains the counts for moves and crashes. This object has getters and setters and also methods to increament the count.
 */
class Counter{
  constructor(moves, crashes){
    this._moves = moves;
    this._crashes = crashes;
  }

  addMove(){
    this._moves = this._moves + 1;
  }
  set moves(m){
    this._moves = m;
  }
  get moves(){
    return this._moves;
  }
  ///////////////////////
  addCrash(){
    this._crashes = this._crashes + 1;
  }
  set crashes(c){
    this._crashes = c;
  }
  get crashes(){
    return this._crashes;
  }
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let player = new Player('images/char-horn-girl.png', 200, 400); //starting values center
let counter = new Counter(0,0);

let allEnemies = [];
for(let i = 0; i < 3; i++){
  for(let j = 0; j < 3; j++){
    let y = (j === 0) ? 63 : (j === 1) ? 145 : 230; //row1=63, row2=145, row3=230
    let x = Math.floor((Math.random() * 502) + -100); // x value between -100 : 502
    let speed =  Math.floor((Math.random() * 250) + 10); //speed between 10 : 300
    allEnemies.push(new Enemy(x, y, speed));
  }
}

setInterval(function(){
  for(bug of allEnemies){
    bug.reset();
  }
}, 2000);

const wins = document.getElementById("wins");
const moves = document.getElementById("moves");
const crashes = document.getElementById("crashes");
const popup = document.getElementById("popup");
const endMoves = document.getElementById("end_moves");
const endCrashes = document.getElementById("end_crashes");
const resetButton = document.getElementById("reset_button");

popup.addEventListener("click", actionPopup);
resetButton.addEventListener("click", resetGame);

function actionPopup(evt) {
  let id = evt.target.id;
  if (id === "close_window") {
    popup.classList.toggle("hide", true);
  } else if (id === "play_again") {
    //reset the player & Zero out the scroreboard
    resetGame();
    popup.classList.toggle("hide", true);
  }
}

function resetGame(){
  player.x = 200;
  player.y = 400;
  player.iswinner = false;
  counter.moves = 0;
  counter.crashes = 0;
  moves.textContent = counter.moves;
  crashes.textContent = counter.crashes;
}
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
};
