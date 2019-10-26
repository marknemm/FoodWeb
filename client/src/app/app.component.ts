import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SessionService } from './session/services/session/session.service';
import { PushNotificationService } from './notification/services/push-notification/push-notification.service';
import { JSONDateReviver } from '../../../shared/src/helpers/json-date-reviver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private _matIconReg: MatIconRegistry,
    private _domSanitizer: DomSanitizer,
    jsonDateReviver: JSONDateReviver,
    sessionService: SessionService,
    pushNotificationService: PushNotificationService
  ) {
    this._matIconReg.registerFontClassAlias('fontawesome', 'fa');
    this._initLetterIcons();
    jsonDateReviver.initJSONDateReviver();
    sessionService.refreshSessionStatus().subscribe();
    pushNotificationService.init();
  }

  private _initLetterIcons(): void {
    for (let i = 10; i < 36; i++) {
      const char: string = i.toString(36).toUpperCase();
      const svgUrl: SafeResourceUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(`../assets/${char}.svg`);
      this._matIconReg.addSvgIcon(`letter_${char}`, svgUrl);
    }
  }

  ngOnInit() {}
}
