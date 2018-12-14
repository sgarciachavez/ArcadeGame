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
    if(distance < 75 && player.y > -5){
      //reset Player
      player.x = 200;
      player.y = 400;
    }
};

Enemy.prototype.reset = function(){
  //Maybe change the speed as well.
  if(this.x > 501){
    this.x = -100;
    //Assign new speed
    this.speed = Math.floor((Math.random() * 300) + 10);
  }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player{
  constructor(sprite, x, y){
    this.x = x;
    this.y = y;
    this.sprite = sprite;
  }
  //add methods here
  update(){

  }
  handleInput(keyCode){

    if(keyCode === "up"){
      //decrease the y value
      let newy = this.y - 15;
      if(newy > -15){
        this.y = newy;
      }
    }
    if(keyCode === "down"){
      //increase the y value
      let newy = this.y + 15;
      if(newy < 450){
        this.y = newy;
      }
    }

    if(keyCode === "right"){
      //increase the x value
      let newx = this.x + 15;
      if(newx < 420){
        this.x = newx;
      }
    }
    if(keyCode === "left"){
      //decrease the x value
      let newx = this.x - 15;
      if(newx > -20){
        this.x = newx;
      }
    }

  }
  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let player = new Player('images/char-horn-girl.png', 200, 400); //starting values center

let allEnemies = [];
for(let i = 0; i < 3; i++){
  for(let j = 0; j < 3; j++){
    let y = (j === 0) ? 63 : (j === 1) ? 145 : 230; //row1=63, row2=145, row3=230
    let x = Math.floor((Math.random() * 502) + -100); // x value between -100 : 502
    let speed =  Math.floor((Math.random() * 300) + 10); //speed between 10 : 300
    allEnemies.push(new Enemy(x, y, speed));
  }
}

setInterval(function(){
  for(bug of allEnemies){
    bug.reset();
  }
}, 2000);

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
