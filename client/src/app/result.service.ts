import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare var nplayer: number;


@Injectable({
  providedIn: 'root'
})
export class ResultService {

  // uri = 'http://18.85.55.124:4300';
   uri = 'http://localhost:4300';


  constructor(private http: HttpClient) {}

  getResults() {
    return this.http.get(`${this.uri}/results`);
  }

  getResultById(id) {
    return this.http.get(`${this.uri}/results/${id}`);
  }

  addResult(player, bot) {
    //
    // const result = {
    //   "player": 5,
    //   "bot": 10
    // };
    // return this.http.post(`${this.uri}/results/add`, result);
    // nplayer : Number =
    // nplayer =

    console.log(player['value']-1);
    console.log(bot['value']-1);

    return this.http.post(`${this.uri}/results/add`,
      {
        "player": player['value']-1 ,
        "bot": bot['value']-1
      })
      .subscribe(
        (val) => {
          console.log("POST call successful value returned in body",
            val);
        },
        response => {
          console.log("POST call in error", response);
        },
        () => {
          console.log("The POST observable is now completed.");
        });
  }

}
