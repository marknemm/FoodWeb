import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { SplashScreen } from '@capacitor/splash-screen';
import { arrowBack, menu } from 'ionicons/icons';
import { AuthenticationService } from '~hybrid/session/services/authentication/authentication.service';
import { JSONDateReviver } from '~shared';
import { SessionService } from '~hybrid/session/services/session/session.service';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';

@Component({
  selector: 'foodweb-hybrid-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  readonly arrowBack = arrowBack;
  readonly menu = menu;

  constructor(
    public sessionService: SessionService,
    public pageProgressService: PageProgressService,
    authService: AuthenticationService,
    jsonDateReviver: JSONDateReviver,
    matIconReg: MatIconRegistry,
  ) {
    matIconReg.registerFontClassAlias('fontawesome', 'fa');
    jsonDateReviver.initJSONDateReviver();
    authService.refreshSessionStatus().subscribe();
    setTimeout(() => SplashScreen.hide(), 1500);
  }
}
