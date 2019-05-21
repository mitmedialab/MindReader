import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  constructor() {
    this.loadScripts();
  }


  loadScripts() {
    // const dynamicScripts = [
    //   'https://platform.twitter.com/widgets.js',
    //   '<script src="C:\\Users\\
    //   Mirit\\WebstormProjects\\client\\client\\src\\MindReaderGame.js"></script>\n' +
    //   '<script src="C:\\Users\\Mirit\\WebstormProjects\\client\\client\\src\\MindReaderGUI.js"></script>\n' +
    //   '<script src="C:\\Users\\Mirit\\WebstormProjects\\client\\client\\src\\MindReaderAlg.js"></script>'
    // ];
    // for (let i = 0; i < dynamicScripts.length; i++) {
    //   const node = document.createElement('script');
    //   node.src = dynamicScripts[i];
    //   node.type = 'text/javascript';
    //   node.async = false;
    //   // node.characterSet = 'utf-8';
    //   document.getElementsByTagName('head')[0].appendChild(node);
    // }
  }
}

