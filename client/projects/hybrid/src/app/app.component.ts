import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { AuthenticationService } from '~hybrid/session/services/authentication/authentication.service';
import { JSONDateReviver } from '~shared';

@Component({
  selector: 'foodweb-hybrid-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    authService: AuthenticationService,
    jsonDateReviver: JSONDateReviver,
    matIconReg: MatIconRegistry,
  ) {
    matIconReg.registerFontClassAlias('fontawesome', 'fa');
    jsonDateReviver.initJSONDateReviver();
    authService.refreshSessionStatus().subscribe();
  }
}
