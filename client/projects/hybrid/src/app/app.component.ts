import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { HybridDataService } from './hybrid-session/services/hybrid-data/hybrid-data.service';

@Component({
  selector: 'foodweb-hybrid-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    hybridDataService: HybridDataService,
    matIconReg: MatIconRegistry,
  ) {
    hybridDataService.init();
    matIconReg.registerFontClassAlias('fontawesome', 'fa');
  }
}
