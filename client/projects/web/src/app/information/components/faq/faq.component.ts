import { Component } from '@angular/core';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {

  constructor(shellService: ShellService) {
    shellService.pageTitle = 'FAQs';
  }

}
