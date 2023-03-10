import { Component } from '@angular/core';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {

  constructor(shellService: ShellService) {
    shellService.pageTitle = 'Privacy Policy';
  }

}
