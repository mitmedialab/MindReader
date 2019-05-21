// This file maintains the basic graphics of the game


//graphics variables
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var GUIscoreWidth = canvas.width*0.2;
var GUIscoreHeight = canvas.height*0.8/(numberOfGameTurns/2);
var GUIuserScoreParam =    {x: canvas.width/2-GUIscoreWidth-GUIscoreWidth/4,  y: canvas.height-20, y_text: canvas.height-5, color: "blue"};
var GUImachineScoreParam = {x: canvas.width/2+GUIscoreWidth/4,                y: canvas.height-20, y_text: canvas.height-5, color: "red"};
var GUItimeParam = {x: canvas.width/2, y: 20, color: "black"};
var GUIendMessage = {x: canvas.width/2, y: canvas.height/2, color: "black", font:"90px Arial"};

//Main screen refresh function
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawScores();

  requestAnimationFrame(draw);
}
draw();

//Draw the two bar scores
function drawScores() {
  ctx.font = "16px Arial";

  //Draw the user bar
  ctx.beginPath();
  ctx.rect(GUIuserScoreParam.x, GUIuserScoreParam.y-userScore*GUIscoreHeight, GUIscoreWidth, userScore*GUIscoreHeight);
  ctx.fillStyle = GUIuserScoreParam.color;
  ctx.fill();
  ctx.closePath();

  //Draw the user text
  ctx.fillStyle = GUIuserScoreParam.color;
  ctx.textAlign="center";
  ctx.fillText("User: "+userScore, GUIuserScoreParam.x+GUIscoreWidth/2, GUIuserScoreParam.y_text);

  //Draw the machine bar
  ctx.beginPath();
  ctx.rect(GUImachineScoreParam.x, GUImachineScoreParam.y-machineScore*GUIscoreHeight, GUIscoreWidth, machineScore*GUIscoreHeight);
  ctx.fillStyle = GUImachineScoreParam.color;
  ctx.fill();
  ctx.closePath();

  //Draw the machine text
  ctx.fillStyle = GUImachineScoreParam.color;
  ctx.textAlign="center";
  ctx.fillText("Machine: "+machineScore, GUImachineScoreParam.x+GUIscoreWidth/2, GUImachineScoreParam.y_text);

  //Draw the time text
  ctx.fillStyle = GUItimeParam.color;
  ctx.textAlign="center";
  ctx.fillText("Time left: "+timeLeft, GUItimeParam.x, GUItimeParam.y);

  if (waitForRestart==1) {
    ctx.font = GUIendMessage.font;
    ctx.fillStyle = GUIendMessage.color;
    ctx.textAlign="center";
    ctx.fillText("You Won!", GUIendMessage.x, GUIendMessage.y);
  }
  else if (waitForRestart==2) {
    ctx.font = GUIendMessage.font;
    ctx.fillStyle = GUIendMessage.color;
    ctx.textAlign="center";
    ctx.fillText("You Lost!", GUIendMessage.x, GUIendMessage.y);
  }


}
