import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ResultService {

  uri = 'http://18.85.55.124:4300';
   // uri = 'http://localhost:4300';


  constructor(private http: HttpClient) {}

  getResults() {
    return this.http.get(`${this.uri}/results`);
  }

  getResultById(id) {
    return this.http.get(`${this.uri}/results/${id}`);
  }

  addResult(player, bot, overall) {
    // console.log("overall:" + overall);
    // console.log("player:" + player);
    //
    // console.log("bot:" + bot);

    return this.http.post(`${this.uri}/results/add`,
      {
        "player": player,
        "bot": bot,
        "overall": overall
      })
      .subscribe(
        (val) => {
          // console.log("POST call successful value returned in body",
          //   val);
        },
        response => {
          console.log("POST call in error", response);
        },
        () => {
          // console.log("The POST observable is now completed.");
        });
  }

}
