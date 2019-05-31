import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
// import { MainComponent } from './components/main/main.component';
import {HttpClientModule} from '@angular/common/http';
// import { MatToolbarModule } from '@angular/material';

import {
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
const routes: Routes = [
  // {
    // path: 'main', component: MainComponent }
  // ,
  // { path: '', redirectTo: '/main', pathMatch: 'full'}
];
@NgModule({
  declarations: [
    AppComponent,
    GameComponent
    // ,
    // MainComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    NoopAnimationsModule,
    MatToolbarModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]


})
export class AppModule {
}
