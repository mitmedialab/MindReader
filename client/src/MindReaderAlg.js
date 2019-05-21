// // This file maintains the bot status and creates predictions.
//
// const USERWIN = -1;
// const BOTWIN = 1;
// const REGULAR_DATA_SERIES = 1;
// const FLIPPING_DATA_SERIES = 2;
// const USER_REACTIVE = 3;
// const BOT_REACTIVE = 4;
// const USER_REACTIVE_REG_DATA = 5;
//
//
// class Bot {
//   constructor(numberOfGameTurns) {
//       this.resetBot(numberOfGameTurns);
//   }
//
//   resetBot(numberOfGameTurns) {
//       //Initialize all arrays.
//       this.userMoves = [];   //holds past user moves
//       this.userMovesFlipping = [];   //holds past user moves in the flipping case (if current=last then 1 else -1)
//       this.botMoves = [];    //holds past bot moves  (including the current prediction, so its size is always gameTurn+1)
//       this.wins = [];        // holds the history of who won
//       this.gameTurn = 0;    // current game turn - pointer to the head of these arrays.
//       this.numberOfGameTurns = numberOfGameTurns;
//
//       this.initPredictors();
//
//       this.updateBotPrediction();
//   }
//
//   updateUserMove(userMove) {
//       //update user move array
//       this.userMoves.push(userMove);
//
//       //update user flipping array
//       if (this.userMoves.length > 1) {
//           if (this.userMoves[this.gameTurn] == this.userMoves[this.gameTurn-1]) {
//               this.userMovesFlipping.push(-1);
//           }
//           else {
//               this.userMovesFlipping.push(1);
//           }
//       }
//
//       //update the who won array
//       if (userMove == this.getBotPrediction()) {
//           this.wins.push(BOTWIN);
//       }
//       else {
//           this.wins.push(USERWIN);
//       }
//
//       this.gameTurn+=1;      //move to the next turn and update the bot prediction for the next round
//       this.updateBotPrediction();
//   }
//
//   getBotPrediction() {    //get current bot prediction
//       return this.botMoves[this.gameTurn];
//   }
//
//   updateBotPrediction() {
//       var botPrediction, botPredictionProb;
//
//       botPredictionProb = this.aggregateExperts();
//
//       var sample = Math.random()*2-1;
//       if (botPredictionProb<sample) {
//           botPrediction = -1;
//       }
//       else {
//           botPrediction = 1;
//       }
//
//       this.botMoves[this.gameTurn] = botPrediction;
//   }
//
//   aggregateExperts() { // implements the expert setting algorithm
//       var eta = Math.sqrt( Math.log(this.predictors.length) / (2*this.numberOfGameTurns - 1) );
//       var expertPastAccuracy, expertWeight, currentPrediction, expertInd, q, denominator, numerator;
//
//       denominator = 0;
//       numerator = 0;
//       for (expertInd=0; expertInd<this.predictors.length; expertInd++) {
//           expertPastAccuracy = this.predictors[expertInd].getPastAccuracy(this.userMoves);
//           expertWeight = Math.exp(-1 * eta * expertPastAccuracy);
//           currentPrediction = this.predictors[expertInd].makePrediction(this.userMoves, this.userMovesFlipping, this.wins);
//           numerator += currentPrediction * expertWeight;
//           denominator += expertWeight;
//       }
//       q = numerator / denominator;
//       return  q;
//   }
//
//   randomPredictor() {   //just a random predictor
//       return Math.round(Math.random())*2-1;
//   }
//
//   initPredictors() {
//       this.predictors = [];
//
//       var biasPredictorMemory = [2, 3, 5];
//       var biasPredictorType   = REGULAR_DATA_SERIES;
//       for (var bp=0; bp<biasPredictorMemory.length; bp++) {
//           this.predictors.push(new biasPredictor(biasPredictorMemory[bp], biasPredictorType));
//       }
//
//       var biasPredictorMemory = [2, 3, 5];
//       var biasPredictorType   = FLIPPING_DATA_SERIES;
//       for (var bp=0; bp<biasPredictorMemory.length; bp++) {
//           this.predictors.push(new biasPredictor(biasPredictorMemory[bp], biasPredictorType));
//       }
//
//       var patternPredictorMemory = [2, 3, 4, 5];
//       var patternPredictorType   = REGULAR_DATA_SERIES;
//       for (var bp=0; bp<patternPredictorMemory.length; bp++) {
//           this.predictors.push(new patternPredictor(patternPredictorMemory[bp], patternPredictorType));
//       }
//
//       var patternPredictorMemory = [2, 3, 4, 5];
//       var patternPredictorType   = FLIPPING_DATA_SERIES;
//       for (var bp=0; bp<patternPredictorMemory.length; bp++) {
//           this.predictors.push(new patternPredictor(patternPredictorMemory[bp], patternPredictorType));
//       }
//
//       var reactivePredictorMemory = [1,2];
//       var reactivePredictorType   = USER_REACTIVE;
//       for (var bp=0; bp<reactivePredictorMemory.length; bp++) {
//           this.predictors.push(new reactivePredictor(reactivePredictorMemory[bp], reactivePredictorType));
//       }
//
//       var reactivePredictorMemory = [1,2];
//       var reactivePredictorType   = USER_REACTIVE_REG_DATA;
//       for (var bp=0; bp<reactivePredictorMemory.length; bp++) {
//           this.predictors.push(new reactivePredictor(reactivePredictorMemory[bp], reactivePredictorType));
//       }
//   }
// }
//
// //This class is a predictor prototype
// class predictor {
//     constructor(memoryLength, dataType) {
//         //predictor parameters
//         this.memoryLength = memoryLength;  //history length to look at
//         this.dataType = dataType;          // REGULAR_DATA_SERIES means to operate on the direct input, FLIPPING_DATA_SERIES means to operate on the flipping series
//         this.predictionsHistory = [];
//     }
//
//     getPastAccuracy(userMoves) {
//         var pastAccuracy, ind;
//         pastAccuracy = 0;
//         for (ind=0; ind<userMoves.length; ind++) {
//           pastAccuracy += Math.abs( userMoves[ind] - this.predictionsHistory[ind] );
//         }
//         return pastAccuracy;
//     }
//
//     makePrediction(userMoves, userMovesFlipping, wins) {
//         var prediction;
//
//         if (this.dataType == REGULAR_DATA_SERIES) {
//             prediction = this.childPredictor(userMoves);
//         }
//         else if (this.dataType == FLIPPING_DATA_SERIES) {  //calculate the mean of the last memoryLength moves
//             prediction = this.childPredictor(userMovesFlipping) * userMoves[userMoves.length-1] * -1; // flip or not the last user move
//         }
//         else if (this.dataType == USER_REACTIVE) {  //calculate the mean of the last memoryLength moves
//             prediction = this.childPredictor(userMovesFlipping, wins) * userMoves[userMoves.length-1] * -1; // flip or not the last user move
//         }
//         else if (this.dataType == USER_REACTIVE_REG_DATA) {  //calculate the mean of the last memoryLength moves
//             prediction = this.childPredictor(userMoves, wins);
//         }
//
//         if (isNaN(prediction)) {
//             prediction = 0;
//         }
//
//         this.predictionsHistory.push(prediction);
//         return prediction;
//     }
// }
//
// //This class predicts the case of a biased user
// class biasPredictor extends predictor {
//     childPredictor(data) {
//         var cnt = 0;
//         var historyMean = 0;
//         while ( cnt<this.memoryLength && (data.length - cnt)>0 ) {
//             historyMean += data[data.length - cnt - 1];
//             cnt +=1;
//         }
//         historyMean /= cnt;
//         return historyMean;
//     }
// }
//
// //This class predicts the case of a patterned user
// class patternPredictor extends predictor {
//     childPredictor(data) {
//         var pattern, prediction, score, ind;
//
//         if (data.length < this.memoryLength) {
//           return 0;
//         }
//
//         function rotatePattern() {
//             var temp = pattern.pop();
//             pattern.unshift(temp);
//         }
//
//         //extract history length
//         pattern = data.slice(-this.memoryLength);
//         prediction = pattern[0];  //the prediction is simply the element in the pattern (i.e. the first in this extracted array)
//
//
//         score = 0;
//         ind = data.length-this.memoryLength-1;  //start right before the pattern
//         while (ind>=Math.max(0, data.length-3*this.memoryLength)) { //check maximum 2 appearances of the full pattern
//             if (pattern[pattern.length-1]==data[ind]) {
//               score++;
//             }
//             rotatePattern()
//             ind--;
//         }
//         score /= (2*this.memoryLength);  //the maximum score is achieved when the pattern repeats itself twice
//         return prediction * score;
//     }
// }
//
//
// //This class predicts the case of a reactive user
// class reactivePredictor extends predictor {
//     constructor(memoryLength, dataType) {
//         super(memoryLength, dataType);
//         this.stateMachine = new Array(Math.pow(2, 2*memoryLength-1)).fill(0);
//         this.indMap = [];
//         for (var i=2*memoryLength; i>=0; i--) {
//           this.indMap.push(Math.pow(2, i));
//         }
//     }
//     childPredictor(moves, wins) {
//         // figure out what was the last state
//         var partOfMoves = moves.slice(moves.length - this.memoryLength    , moves.length - 1);
//         var partOfWins  = wins.slice (wins.length  - this.memoryLength - 1 , wins.length - 1);
//         var lastState = partOfWins.concat(partOfMoves);
//         var lastStateInd = 0
//         for (var i=0; i<lastState.length; i++) {
//             if (lastState[i]==1) {
//                 lastStateInd += Math.pow(2,i);
//             }
//         }
//         var lastStateResult = moves[moves.length-1];
//
//         //update the state machine
//         if (this.stateMachine[lastStateInd] == 0) { //no prior info
//             this.stateMachine[lastStateInd] = lastStateResult*0.3;
//         }
//         else if (this.stateMachine[lastStateInd] == lastStateResult*0.3) {  //we've been here before so strengthen prediction
//             this.stateMachine[lastStateInd] = lastStateResult*0.8;
//         }
//         else if (this.stateMachine[lastStateInd] == lastStateResult*0.8) { //we've been here before so strengthen prediction
//             this.stateMachine[lastStateInd] = lastStateResult*1;
//         }
//         else if (this.stateMachine[lastStateInd] == lastStateResult*1) { //maximum confidence
//             this.stateMachine[lastStateInd] = lastStateResult*1;
//         }
//         else {  //changed his mind - so go back to 0
//             this.stateMachine[lastStateInd] = 0;
//         }
//
//         // what is the current state
//         var currentPartOfMoves = moves.slice(moves.length - this.memoryLength + 1    , moves.length);
//         var currentPartOfWins  = wins.slice (wins.length  - this.memoryLength , wins.length);
//         var currentState = currentPartOfWins.concat(currentPartOfMoves);
//         var currentStateInd = 0
//         for (var i=0; i<currentState.length; i++) {
//             if (currentState[i]==1) {
//                 currentStateInd += Math.pow(2,i);
//             }
//         }
//
//         var predictionAndScore = this.stateMachine[currentStateInd]
//
//       //  console.log('last state ', lastState, ', last ind ', lastStateInd, '    current state ', currentState, '  current ind ', currentStateInd, '    state machine: ', this.stateMachine);
//         return predictionAndScore;
//     }
// }
