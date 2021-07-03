import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { JSONDateReviver } from '~shared';
import { IeAlertService } from '~web/alert/services/ie-alert/ie-alert.service';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';

@Component({
  selector: 'foodweb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    authService: AuthenticationService,
    ieAlert: IeAlertService,
    jsonDateReviver: JSONDateReviver,
    matIconReg: MatIconRegistry,
  ) {
    matIconReg.registerFontClassAlias('fontawesome', 'fa');
    ieAlert.showIEWarning();
    jsonDateReviver.initJSONDateReviver();
    authService.refreshSessionStatus().subscribe();
  }
}
