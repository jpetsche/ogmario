/***************************************************************
*------------------------SETUP CANVAS---------------------------
***************************************************************/

//disabling form reset when enter is pressed
$(function() {
  $("form").submit(function() {return false;});
});

//holds value of keyDown
var keymap = {32: false, 37: false, 38: false, 39: false, 40: false,
  65: false, 68: false, 69: false, 82: false, 83: false, 87: false, 13: false};

/***************************************************
*--------------loads HTML Attributes----------------
***************************************************/

//game canvas
var canvas = document.getElementById("gameBorder");

/***************************************************
*-------------------loads images--------------------
***************************************************/

/***************************************************
*-------------------loads sounds--------------------
***************************************************/

/***************************************************
*-------------Game Objects and Arrays---------------
***************************************************/
var numPlayers = 0;
var playerObj = {};
var projObj = {};
var enemyObj = {};
var ctx = canvas.getContext("2d");
var keyDown = false;

//function to create the player object
function player()
{
	this.x = 10;
	this.y = 10;
	this.id = 1;
	this.width = 50;
	this.height = 50;
	this.facing = "right";
	this.score = 0;
	this.inAir = 0;
}


/***************************************************************
*-----------------------CANVAS ANIMATION------------------------
***************************************************************/


//For each animation frame, we can update the elements on the canvas, clear the canvas, redraw the canvas, and then request another animation frame
window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      })();


//handles animation of the square/s
function animate(myPlayer, canvas, context, direction, startY, startX) {
	  update();
      var time = (new Date()).getTime()  - start;

      var linearSpeed = 100;

  		if(myPlayer.facing == 'left') {
  			var newX = -1*(linearSpeed * time / 1000) + startX;
  			newY = myPlayer.y;
  		}

  		else if(direction == 'right') {
  			var newX = (linearSpeed * time / 1000) + startX;
  			newY = myPlayer.y;
  		}

  		else if(direction == 'up') {
  			var newY = -1*(linearSpeed * time / 1000) + startY;
  			newX = myPlayer.x;
  		}

  		else if(direction == 'down') {
  			var newY = (linearSpeed * time / 1000) + startY;
  			newX = myPlayer.x;
  		}

  		if((newX < canvas.width - myPlayer.width && newX >= 0)) {
  			myPlayer.x = newX;
  			myPlayer.y = newY;
  		}

  		// clears old square from screen
  		context.clearRect(0, 0, canvas.width, canvas.height);
  		// draws new square in new position
  		drawRect(myPlayer, context);

  		requestAnimFrame( function() {
  			animate(myPlayer, canvas, context, direction, startY, startX)
  		});
}

/***************************************************************
*-----------------------CANVAS DRAWING--------------------------
***************************************************************/

function drawPlayer(player, context)
{
	context.beginPath();
	context.player(player.x, player.y, player.width, player.height);
	context.fillStyle = 'green';
	//sprite to be used in animation cycles
	var sprite;

	context.fill();
}

/***************************************************************
*-----------------UPDATE CANVAS FROM KEYPRESS-------------------
***************************************************************/

var timer = null;
var pressed = 0;
//function that loops until key release
function keypress(move)
{
  if(pressed == 0)
  {
    if(move == "equip")
    {
      sendMove(playerId, move);
    }
    else
    {
      timer = setInterval(function() { sendMove(playerId, move);}, 30);
    }
    pressed = 1;
  }
  else if(pressed == 1)
  {
    if(isleft == 1 && isup == 1)
    {
      clearInterval(timer);
      timer = setInterval(function() { sendMove(playerId, "upleft");}, 30);
    }
    else if(isright == 1 && isup == 1)
    {
      clearInterval(timer);
      timer = setInterval(function() { sendMove(playerId, "upright");}, 30);
    }
    else if(isleft == 1 && isdown == 1)
    {
      clearInterval(timer);
      timer = setInterval(function() { sendMove(playerId, "downleft");}, 30);
    }
    else if(isright == 1 && isdown == 1)
    {
      clearInterval(timer);
      timer = setInterval(function() { sendMove(playerId, "downright");}, 30);
    }
  }
}

//function that stops the loop of sending movements
function stopkey()
{
  clearInterval(timer);
  if(isleft == 1 && isup == 1)
  {
    timer = setInterval(function() { sendMove(playerId, "upleft");}, 30);
  }
  else if(isright == 1 && isup == 1)
  {
    timer = setInterval(function() { sendMove(playerId, "upright");}, 30);
  }
  else if(isleft == 1 && isdown == 1)
  {
    timer = setInterval(function() { sendMove(playerId, "downleft");}, 30);
  }
  else if(isright == 1 && isdown == 1)
  {
    timer = setInterval(function() { sendMove(playerId, "downright");}, 30);
  }
  else if(isleft == 1)
  {
    timer = setInterval(function() { sendMove(playerId, "left");}, 30);
  }
  else if(isright == 1)
  {
    timer = setInterval(function() { sendMove(playerId, "right");}, 30);
  }
  else if(isup == 1)
  {
    timer = setInterval(function() { sendMove(playerId, "up");}, 30);
  }
  else if(isdown == 1)
  {
    timer = setInterval(function() { sendMove(playerId, "down");}, 30);
  }
  else if(isspace == 1)
  {
    timer = setInterval(function() { sendMove(playerId, "attack");}, 30);
  }
  else if(isequip == 1)
  {
    timer = setInterval(function() { sendMove(playerId, "equip");}, 30);
  }
  else
  {
    pressed = 0;
  }

}

//is down variables for directional keys
var isleft = 0;
var isright = 0;
var isup = 0;
var isdown = 0;
var isspace = 0;
var isequip = 0;

$(window).keydown(function(e){
    if(e.keyCode in keymap){
      keymap[e.keyCode] =  true;
      if(document.activeElement.name != "usermsg")
      {
         if([32, 37, 38, 39, 40, 65, 68, 69, 82, 83, 87].indexOf(e.keyCode) > -1)
              {
                e.preventDefault();
              }

              //if up-left are both pressed
              if((keymap[37] || keymap[65]) && (keymap[38] || keymap[87]))
              {
                keypress("upleft");
                isup = 1;
                isleft = 1;
              }

              //if up-right are both pressed
              else if((keymap[39] || keymap[68]) && (keymap[38] || keymap[87]))
              {
                keypress("upright");
                isup = 1;
                isright = 1;
              }

              //if down-left are both pressed
              else if((keymap[37] || keymap[65]) && (keymap[40] || keymap[83]))
              {
                keypress("downleft");
                isdown = 1;
                isleft = 1;
              }

              //if down-right are both pressed
              else if((keymap[39] || keymap[68]) && (keymap[40] || keymap[83]))
              {
                keypress("downright");
                isdown = 1;
                isright = 1;
              }

              //If left arrow key is pressed
              else if(keymap[37] || keymap[65]){
                keypress("left");
                isleft = 1;
              }

              //If up arrow key is pressed
              else if(keymap[38] || keymap[87]){
                keypress("up");
                isup = 1;
              }

              //If right arrow key is pressed
              else if(keymap[39] || keymap[68]){
                keypress("right");
                isright = 1;
              }

              //If down arrow key is pressed
              else if(keymap[40] || keymap[83]){
                keypress("down");
                isdown = 1;
              }

              //if space key is pressed
              else if(keymap[32]){
                keypress("attack");
                isspace = 1;
              }

              //If E key is pressed
              else if(keymap[69]){
                keypress("equip");
                isequip = 1;
              }

              //If R key is pressed
              else if(keymap[82]){
                keypress("respawn");
              }
      }

      //if enter is clicked to submit message
      else if(keymap[13]){
        //sendmessage to server
        chatLog(document.getElementById("usermsg").value);
      }
    }
	});

$(window).keyup(function(e){
    if(e.keyCode in keymap){
      keymap[e.keyCode] = false;
      if(document.activeElement.name != "usermsg")
      {
        if(e.keyCode == 37 || e.keyCode == 65)
        {
          isleft = 0;
        }
        else if(e.keyCode == 38 || e.keyCode == 87)
        {
          isup = 0;
        }
        else if(e.keyCode == 39 || e.keyCode == 68)
        {
          isright = 0;
        }
        else if(e.keyCode == 40 || e.keyCode == 83)
        {
          isdown = 0;
        }
        else if(e.keyCode == 69)
        {
          isequip = 0;
        }
        else if(e.keyCode == 32)
        {
          isspace = 0;
        }
        stopkey();
      }
    }
});