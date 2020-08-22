import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { JSONDateReviver } from '~shared';
import { AlertQueueService } from '~web/alert/services/alert-queue/alert-queue.service';
import { AlertService } from '~web/alert/services/alert/alert.service';
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
    alertQueueService: AlertQueueService,
    alertService: AlertService,
    authService: AuthenticationService,
    ieAlert: IeAlertService,
    jsonDateReviver: JSONDateReviver,
  ) {
    this._matIconReg.registerFontClassAlias('fontawesome', 'fa');
    this._initLetterIcons();
    ieAlert.showIEWarning();
    jsonDateReviver.initJSONDateReviver();
    alertQueueService.registerDefaultAlertProcessor(alertService);
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
