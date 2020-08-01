import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { JSONDateReviver } from '~shared';
import { AuthenticationService } from './session/services/authentication/authentication.service';

@Component({
  selector: 'foodweb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private _matIconReg: MatIconRegistry,
    private _domSanitizer: DomSanitizer,
    authService: AuthenticationService,
    jsonDateReviver: JSONDateReviver,
  ) {
    this._matIconReg.registerFontClassAlias('fontawesome', 'fa');
    this._initLetterIcons();
    jsonDateReviver.initJSONDateReviver();
    authService.refreshSessionStatus().subscribe();
  }

  private _initLetterIcons(): void {
    for (let i = 10; i < 36; i++) {
      const char: string = i.toString(36).toUpperCase();
      const svgUrl: SafeResourceUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(`../assets/${char}.svg`);
      this._matIconReg.addSvgIcon(`letter_${char}`, svgUrl);
    }
  }
}
