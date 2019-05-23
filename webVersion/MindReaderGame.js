// This file controls the game progress. It creates a bot instance, and maintains the interaction with the user.
// All game paramteres (like number of turns) are at the bottom of this file.

//game parameters
var numberOfGameTurns, maxTime, timePerTurn;

//game status variables
var userScore, machineScore, turnNumber, timeLeft, currentTurnTime, gameStarted, waitForRestart;

//bot instance
var bot;

//start timer
t = setInterval(updateTime, 1000);

//Keyboard event listeners
document.addEventListener("keydown", keyDownHandler, false);
function keyDownHandler(e) {
  if(e.which == 39) {  //Right key
      userAction(1);
  }
  else if(e.which == 37) { //Left key
      userAction(-1);
  }
}

restartGame();

function updateTime() {
  if (gameStarted==1) {
    timeLeft -= 1;
    currentTurnTime -= 1;

    if (timeLeft==0) {
      machineScore+=1;
      timeLeft = maxTime;
      currentTurnTime=timePerTurn;
      scoreUpdate();
    }
  }
  updateGraphics();
}

//Update the machine status with the user choice
function userAction(key) {
  if (waitForRestart>0) {
    return;
  }
  gameStarted = 1;

  if (currentTurnTime>0) {
    timeLeft+=currentTurnTime
    if (timeLeft>maxTime) {
      timeLeft=maxTime;
    }
  }
  currentTurnTime=timePerTurn;

  if (bot.getBotPrediction() == key) { //bot won
    machineScore+=1;
  }
  else {
    userScore+=1;
  }

  scoreUpdate();

  bot.updateUserMove(key);
}

function scoreUpdate() {
  if (userScore >= numberOfGameTurns/2) { //gave over user won
    gameStarted=0;
    waitForRestart = 1;
  }

  if (machineScore >= numberOfGameTurns/2) { //gave over user won
    gameStarted=0;
    waitForRestart = 2;
  }
  updateGraphics();
}

function restartGame() {
  numberOfGameTurns = 50; // Total game turns (the goal is to get to half of that, must be even number).
  maxTime = 10;
  timePerTurn = 3;
  userScore = 0;
  machineScore = 0;
  turnNumber = 0;
  timeLeft = maxTime;
  currentTurnTime = timePerTurn;
  gameStarted = 0;
  waitForRestart = 0;
  bot  = new Bot(numberOfGameTurns);
  updateGraphics();
}
