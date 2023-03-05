import { Component } from '@angular/core';
import { SessionService } from '~web/session/services/session/session.service';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {

  constructor(
    public shellService: ShellService,
    public sessionService: SessionService
  ) {}

  get footerAttributions(): string[] {
    return this.shellService.footerAttributions ?? [];
  }

  get pageTitle(): string {
    return this.shellService.pageTitle ?? '';
  }

  toggleLeftNav(): void {
    this.shellService.toggleLeftNav();
  }

}
