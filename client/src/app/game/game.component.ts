import { Component, OnInit } from '@angular/core';
// import {Result} from '../result.model';
 // import  './../../MindReaderGame';
 //   import * as _ from '../../assets/MindReaderGame';
 // import * as Bot from './../../MindReaderAlg';
import { ResultService } from '../result.service';
import { Result } from '../result.model';
import {Router} from '@angular/router';



declare var scores: any;
declare var waitForRestart: any;
declare var gameStarted: any;


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  results: Result[];
  isSent = false;


  constructor(private resultService: ResultService, private router: Router) { }

  ngOnInit() {
    this.fetchResults();

    setInterval( () => {
      if (+waitForRestart > 0 && gameStarted === 0 && !this.isSent)
      {
        this.addResult();
      }
      else if (+waitForRestart == 0 && gameStarted == 0){
        this.isSent = false;
      }
      // this.addResult();
    }, 500);
  }

  userActiont(inp: string): void {
    console.log("TS");

    // console.log(waitForRestart);

    userAction(1);
  }

  restartGamet(): void  {
    // console.log('hurray!');

    restartGame();
  }

  fetchResults() {
    this.resultService
      .getResults()
      .subscribe((data: Result[]) => {
        this.results = data;
        console.log('Data requested ... ');
        console.log(this.results);
      });
  }

  editResult(id) {
    this.router.navigate([`/edit/${id}`]);
  }


  addResult(): void {
    console.log(scores[0]);
    console.log(scores[2]);
    this.isSent = true;
    this.resultService.addResult(scores[0], scores[2] );
  }
}


