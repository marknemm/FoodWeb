import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { JSONDateReviver } from '~shared';
import { DefaultAlertProcessorService } from '~web/alert/services/default-alert-processor/default-alert-processor.service';
import { IeAlertService } from '~web/alert/services/ie-alert/ie-alert.service';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';

@Component({
  selector: 'foodweb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private _matIconReg: MatIconRegistry,
    private _domSanitizer: DomSanitizer,
    authService: AuthenticationService,
    ieAlert: IeAlertService,
    jsonDateReviver: JSONDateReviver,
    defaultAlertProcessorService: DefaultAlertProcessorService
  ) {
    this._matIconReg.registerFontClassAlias('fontawesome', 'fa');
    this._initLetterIcons();
    ieAlert.showIEWarning();
    jsonDateReviver.initJSONDateReviver();
    defaultAlertProcessorService.monitorAlerts();
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
