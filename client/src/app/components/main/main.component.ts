import { Component, OnInit } from '@angular/core';

declare var scores: any;
declare var waitForRestart: any;
declare var gameStarted: any;

import { Result } from '../../result.model';
//TODO: remove component


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {


  results: Result[];
  displayedColumns = ['title', 'responsible', 'severity', 'status', 'actions'];

  constructor() {
  }

  ngOnInit() {

  }
}

