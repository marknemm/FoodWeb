import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    matIconReg: MatIconRegistry,
    domSanitizer: DomSanitizer
  ) {
    matIconReg.registerFontClassAlias('fontawesome', 'fa');
    for (let i = 10; i < 36; i++) {
      const char: string = i.toString(36).toUpperCase();
      const svgUrl: SafeResourceUrl = domSanitizer.bypassSecurityTrustResourceUrl(`../assets/${char}.svg`);
      matIconReg.addSvgIcon(`letter_${char}`, svgUrl);
    }
  }
}
