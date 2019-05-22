// This file controls the game progress. It creates a bot instance, and maintains the interaction with the user.
// All game paramteres (like number of turns) are at the bottom of this file.
// This file maintains the bot status and creates predictions.
//start GUI
var svg = d3.select("#game1")
  .append("svg")
  .append("g")


svg.append("g")
  .attr("class", "slices");

var width = 320,
  height = 320,
  radius = Math.min(width, height) / 2;

var pie = d3.layout.pie()
  .sort(null)
  .value(function(d) {
    return d.value;
  });

var arc = d3.svg.arc()
  .outerRadius(radius * 0.8)
  .innerRadius(radius * 0.)
  .startAngle(function(d) { return d.startAngle + Math.PI; })
  .endAngle(function(d) { return d.endAngle + Math.PI; });

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var key = function(d){ return d.data.label; };

var color = d3.scale.ordinal()
  .domain(["Bot: ", "", "You: "])
  .range(["#DC3912", "#FFFFFF", "#3366CC"]);

var scores=[
  {label:"Bot: ", value:0},
  {label:"", value:0},
  {label:"You: ", value:0}
];

svg.append("text")
  .text("Bot: " + String(scores[0].value-1))
  .attr("id","botText")
  .attr("y",radius*0.9)
  .attr("x",-radius*0.2)
  .attr("text-anchor", "end");

svg.append("text")
  .text("You: " + String(scores[2].value-1))
  .attr("id","youText")
  .attr("y",radius*0.9)
  .attr("x",radius*0.2)
  .attr("text-anchor", "start");

svg.append("text")
  .text("Time left: ")
  .attr("id","timeText")
  .attr("y",-radius*0.9)
  .attr("x",0)
  .attr("font-size",14)
  .attr("text-anchor", "middle");
svg.append("text")
  .attr("id","predictionTimeText")
  .attr("y",-radius*0.8)
  .attr("x",0)
  .attr("font-size",14)
  .attr("text-anchor", "middle");
svg.append("text")
  .text("")
  .attr("id","winText")
  .attr("y",0)
  .attr("x",0)
  .attr("text-anchor", "middle")
  .attr("font-size",50);

function updateGraphics() {
  scores[0].value = machineScore+1;
  scores[2].value = userScore+1;
  scores[1].value = numberOfGameTurns - userScore - machineScore;

  var slice = svg.select(".slices").selectAll("path.slice")
    .data(pie(scores), key);

  slice.enter()
    .insert("path")
    .style("fill", function(d) { return color(d.data.label); })
    .attr("class", "slice");

  slice
    .transition().duration(100)
    .attrTween("d", function(d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        return arc(interpolate(t));
      };
    })

  slice.exit()
    .remove();

  botText.textContent = "Bot: " + String(scores[0].value-1);
  youText.textContent = "You: " + String(scores[2].value-1);
  timeText.textContent = "Time left: " + String(timeLeft);
  predictionTimeText.textContent = timeOfPredictionText;//"Next step perdiction was calculated in " + timeOfPrediction + " miliseconds."

  if (waitForRestart==1) {
    winText.textContent = "You Won!";
  }
  else if (waitForRestart==2) {
    winText.textContent = "You Lost!";
  }
  else {
    winText.textContent = "";
  }


};
//Gui ends
//Alg begin

const USERWIN = -1;
const BOTWIN = 1;
const REGULAR_DATA_SERIES = 1;
const FLIPPING_DATA_SERIES = 2;
const USER_REACTIVE = 3;
const BOT_REACTIVE = 4;
const USER_REACTIVE_REG_DATA = 5;


class Bot {
  constructor(numberOfGameTurns) {
    this.resetBot(numberOfGameTurns);
  }

  resetBot(numberOfGameTurns) {
    //Initialize all arrays.
    this.userMoves = [];   //holds past user moves
    this.userMovesFlipping = [];   //holds past user moves in the flipping case (if current=last then 1 else -1)
    this.botMoves = [];    //holds past bot moves  (including the current prediction, so its size is always gameTurn+1)
    this.wins = [];        // holds the history of who won
    this.gameTurn = 0;    // current game turn - pointer to the head of these arrays.
    this.numberOfGameTurns = numberOfGameTurns;

    this.initPredictors();

    this.updateBotPrediction();
  }

  updateUserMove(userMove) {
    //update user move array
    this.userMoves.push(userMove);

    //update user flipping array
    if (this.userMoves.length > 1) {
      if (this.userMoves[this.gameTurn] == this.userMoves[this.gameTurn-1]) {
        this.userMovesFlipping.push(-1);
      }
      else {
        this.userMovesFlipping.push(1);
      }
    }

    //update the who won array
    if (userMove == this.getBotPrediction()) {
      this.wins.push(BOTWIN);
    }
    else {
      this.wins.push(USERWIN);
    }

    this.gameTurn+=1;      //move to the next turn and update the bot prediction for the next round
    this.updateBotPrediction();
  }

  getBotPrediction() {    //get current bot prediction
    return this.botMoves[this.gameTurn];
  }

  updateBotPrediction() {
    var botPrediction, botPredictionProb;

    botPredictionProb = this.aggregateExperts();

    var sample = Math.random()*2-1;
    if (botPredictionProb<sample) {
      botPrediction = -1;
    }
    else {
      botPrediction = 1;
    }

    this.botMoves[this.gameTurn] = botPrediction;
  }

  aggregateExperts() { // implements the expert setting algorithm
    var eta = Math.sqrt( Math.log(this.predictors.length) / (2*this.numberOfGameTurns - 1) );
    var expertPastAccuracy, expertWeight, currentPrediction, expertInd, q, denominator, numerator;

    denominator = 0;
    numerator = 0;
    for (expertInd=0; expertInd<this.predictors.length; expertInd++) {
      expertPastAccuracy = this.predictors[expertInd].getPastAccuracy(this.userMoves);
      expertWeight = Math.exp(-1 * eta * expertPastAccuracy);
      currentPrediction = this.predictors[expertInd].makePrediction(this.userMoves, this.userMovesFlipping, this.wins);
      numerator += currentPrediction * expertWeight;
      denominator += expertWeight;
    }
    q = numerator / denominator;
    return  q;
  }

  randomPredictor() {   //just a random predictor
    return Math.round(Math.random())*2-1;
  }

  initPredictors() {
    this.predictors = [];

    var biasPredictorMemory = [2, 3, 5];
    var biasPredictorType   = REGULAR_DATA_SERIES;
    for (var bp=0; bp<biasPredictorMemory.length; bp++) {
      this.predictors.push(new biasPredictor(biasPredictorMemory[bp], biasPredictorType));
    }

    var biasPredictorMemory = [2, 3, 5];
    var biasPredictorType   = FLIPPING_DATA_SERIES;
    for (var bp=0; bp<biasPredictorMemory.length; bp++) {
      this.predictors.push(new biasPredictor(biasPredictorMemory[bp], biasPredictorType));
    }

    var patternPredictorMemory = [2, 3, 4, 5];
    var patternPredictorType   = REGULAR_DATA_SERIES;
    for (var bp=0; bp<patternPredictorMemory.length; bp++) {
      this.predictors.push(new patternPredictor(patternPredictorMemory[bp], patternPredictorType));
    }

    var patternPredictorMemory = [2, 3, 4, 5];
    var patternPredictorType   = FLIPPING_DATA_SERIES;
    for (var bp=0; bp<patternPredictorMemory.length; bp++) {
      this.predictors.push(new patternPredictor(patternPredictorMemory[bp], patternPredictorType));
    }

    var reactivePredictorMemory = [1,2];
    var reactivePredictorType   = USER_REACTIVE;
    for (var bp=0; bp<reactivePredictorMemory.length; bp++) {
      this.predictors.push(new reactivePredictor(reactivePredictorMemory[bp], reactivePredictorType));
    }

    var reactivePredictorMemory = [1,2];
    var reactivePredictorType   = USER_REACTIVE_REG_DATA;
    for (var bp=0; bp<reactivePredictorMemory.length; bp++) {
      this.predictors.push(new reactivePredictor(reactivePredictorMemory[bp], reactivePredictorType));
    }
  }
}

//This class is a predictor prototype
class predictor {
  constructor(memoryLength, dataType) {
    //predictor parameters
    this.memoryLength = memoryLength;  //history length to look at
    this.dataType = dataType;          // REGULAR_DATA_SERIES means to operate on the direct input, FLIPPING_DATA_SERIES means to operate on the flipping series
    this.predictionsHistory = [];
  }

  getPastAccuracy(userMoves) {
    var pastAccuracy, ind;
    pastAccuracy = 0;
    for (ind=0; ind<userMoves.length; ind++) {
      pastAccuracy += Math.abs( userMoves[ind] - this.predictionsHistory[ind] );
    }
    return pastAccuracy;
  }

  makePrediction(userMoves, userMovesFlipping, wins) {
    var prediction;

    if (this.dataType == REGULAR_DATA_SERIES) {
      prediction = this.childPredictor(userMoves);
    }
    else if (this.dataType == FLIPPING_DATA_SERIES) {  //calculate the mean of the last memoryLength moves
      prediction = this.childPredictor(userMovesFlipping) * userMoves[userMoves.length-1] * -1; // flip or not the last user move
    }
    else if (this.dataType == USER_REACTIVE) {  //calculate the mean of the last memoryLength moves
      prediction = this.childPredictor(userMovesFlipping, wins) * userMoves[userMoves.length-1] * -1; // flip or not the last user move
    }
    else if (this.dataType == USER_REACTIVE_REG_DATA) {  //calculate the mean of the last memoryLength moves
      prediction = this.childPredictor(userMoves, wins);
    }

    if (isNaN(prediction)) {
      prediction = 0;
    }

    this.predictionsHistory.push(prediction);
    return prediction;
  }
}

//This class predicts the case of a biased user
class biasPredictor extends predictor {
  childPredictor(data) {
    var cnt = 0;
    var historyMean = 0;
    while ( cnt<this.memoryLength && (data.length - cnt)>0 ) {
      historyMean += data[data.length - cnt - 1];
      cnt +=1;
    }
    historyMean /= cnt;
    return historyMean;
  }
}

//This class predicts the case of a patterned user
class patternPredictor extends predictor {
  childPredictor(data) {
    var pattern, prediction, score, ind;

    if (data.length < this.memoryLength) {
      return 0;
    }

    function rotatePattern() {
      var temp = pattern.pop();
      pattern.unshift(temp);
    }

    //extract history length
    pattern = data.slice(-this.memoryLength);
    prediction = pattern[0];  //the prediction is simply the element in the pattern (i.e. the first in this extracted array)


    score = 0;
    ind = data.length-this.memoryLength-1;  //start right before the pattern
    while (ind>=Math.max(0, data.length-3*this.memoryLength)) { //check maximum 2 appearances of the full pattern
      if (pattern[pattern.length-1]==data[ind]) {
        score++;
      }
      rotatePattern()
      ind--;
    }
    score /= (2*this.memoryLength);  //the maximum score is achieved when the pattern repeats itself twice
    return prediction * score;
  }
}


//This class predicts the case of a reactive user
class reactivePredictor extends predictor {
  constructor(memoryLength, dataType) {
    super(memoryLength, dataType);
    this.stateMachine = new Array(Math.pow(2, 2*memoryLength-1)).fill(0);
    this.indMap = [];
    for (var i=2*memoryLength; i>=0; i--) {
      this.indMap.push(Math.pow(2, i));
    }
  }
  childPredictor(moves, wins) {
    // figure out what was the last state
    var partOfMoves = moves.slice(moves.length - this.memoryLength    , moves.length - 1);
    var partOfWins  = wins.slice (wins.length  - this.memoryLength - 1 , wins.length - 1);
    var lastState = partOfWins.concat(partOfMoves);
    var lastStateInd = 0
    for (var i=0; i<lastState.length; i++) {
      if (lastState[i]==1) {
        lastStateInd += Math.pow(2,i);
      }
    }
    var lastStateResult = moves[moves.length-1];

    //update the state machine
    if (this.stateMachine[lastStateInd] == 0) { //no prior info
      this.stateMachine[lastStateInd] = lastStateResult*0.3;
    }
    else if (this.stateMachine[lastStateInd] == lastStateResult*0.3) {  //we've been here before so strengthen prediction
      this.stateMachine[lastStateInd] = lastStateResult*0.8;
    }
    else if (this.stateMachine[lastStateInd] == lastStateResult*0.8) { //we've been here before so strengthen prediction
      this.stateMachine[lastStateInd] = lastStateResult*1;
    }
    else if (this.stateMachine[lastStateInd] == lastStateResult*1) { //maximum confidence
      this.stateMachine[lastStateInd] = lastStateResult*1;
    }
    else {  //changed his mind - so go back to 0
      this.stateMachine[lastStateInd] = 0;
    }

    // what is the current state
    var currentPartOfMoves = moves.slice(moves.length - this.memoryLength + 1    , moves.length);
    var currentPartOfWins  = wins.slice (wins.length  - this.memoryLength , wins.length);
    var currentState = currentPartOfWins.concat(currentPartOfMoves);
    var currentStateInd = 0
    for (var i=0; i<currentState.length; i++) {
      if (currentState[i]==1) {
        currentStateInd += Math.pow(2,i);
      }
    }

    var predictionAndScore = this.stateMachine[currentStateInd]

    return predictionAndScore;
  }
}
//end Alg
//game parameters
var numberOfGameTurns, maxTime, timePerTurn;

//game status variables
var userScore, machineScore, turnNumber, timeLeft, currentTurnTime, gameStarted, waitForRestart,timeOfPrediction, timeOfPredictionText = "";

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
  var timeBeforePrediction =  performance.now();

  bot.updateUserMove(key);
  var timeAfterPrediction =  performance.now();

   timeOfPrediction = timeAfterPrediction - timeBeforePrediction
   timeOfPredictionText = 'It took ' + timeOfPrediction.toFixed(2) + ' miliseconds to predict next step.'
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
  //TODO: make sure this doesn't complicate things
  bot  = new Bot(numberOfGameTurns);
  updateGraphics();
}





