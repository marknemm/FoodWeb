import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  sidenavOpened = true;

  constructor(
    matIconReg: MatIconRegistry
  ) {
    matIconReg.registerFontClassAlias('fontawesome', 'fa');
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }
}
