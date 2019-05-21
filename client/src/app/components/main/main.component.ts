import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import {MatSnackBar} from '@angular/material';
import { timer } from 'rxjs';
import {take} from 'rxjs/operators';

declare var scores: any;
declare var waitForRestart: any;
declare var gameStarted: any;
// import {take} from 'rxjs/operators';

import { Result } from '../../result.model';
import { ResultService } from '../../result.service';
import { interval } from 'rxjs';
// import { interval } from 'rxjs';
//TODO: remove component


// Create an Observable that will publish a value on an interval
// Subscribe to begin publishing values
// const secondsCounter = interval(1000);
// // Subscribe to begin publishing values
// secondsCounter.subscribe(n =>
//   console.log(`It's been ${n} seconds since subscribing!`));


  // console.log(`It's been ${n} seconds since subscribing!`));

// Create an Observable that will publish a value on an interval
// const secondsCounter = interval(500);
// // Subscribe to begin publishing values
// secondsCounter.subscribe(n =>
//   // var y = +waitForRestart;
//   console.log('cur num is' + waitForRestart));
// import {from, timer} from 'rxjs';
// import model = require('src/assets/MindReaderGame');

// setTimeout(() => {
//    const num = +waitForRestart;
//    console.log("test");
//    // if (+waitForRestart > 0) {console.log(waitForRestart)
//    // }
// }, 500);
 // import * as _ from 'src/assets/MindReaderGame.js';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {



  results: Result[];
  resultsSent
  displayedColumns = ['title', 'responsible', 'severity', 'status', 'actions'];
  constructor() { }

  ngOnInit() {
    // this.fetchResults();
    // setInterval( () => {if (+waitForRestart > 0 && gameStarted === 0) {this.addResult();
    //   }
    //   // this.addResult();
    // }, 500);
  }
  // declare var test: any;

  // public sampleMethodCall() {

  // }


  // fetchResults() {
  //   this.resultService
  //     .getResults()
  //     .subscribe((data: Result[]) => {
  //       this.results = data;
  //       console.log('Data requested ... ');
  //       console.log(this.results);
  //     });
  // }

  // editResult(id) {
  //   this.router.navigate([`/edit/${id}`]);
  // }


  // addResult(): void {
  //   console.log('adding result');
  //   // console.log(_.scores[0]);
  //   console.log(scores[0]);
  //   // console.log(scores[1]);
  //   console.log(scores[2]);
  //   waitForRestart = 0;
  //   this.resultService.addResult(scores[0], scores[2] );
  // }

  // deleteResult(id) {
  //   this.resultService.deleteResult(id).subscribe(() => {
  //     this.fetchResults();
  //   });
  // }
}

