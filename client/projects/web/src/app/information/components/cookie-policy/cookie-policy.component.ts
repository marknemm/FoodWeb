import { Component } from '@angular/core';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-cookie-policy',
  templateUrl: './cookie-policy.component.html',
  styleUrls: ['./cookie-policy.component.scss']
})
export class CookiePolicyComponent {

  constructor(shellService: ShellService) {
    shellService.pageTitle = 'Cookie Policy';
  }

}
