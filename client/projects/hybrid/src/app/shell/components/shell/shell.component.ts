import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { SessionService } from '~hybrid/session/services/session/session.service';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-hybrid-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  @ViewChild('mainScrollPane', { static: true }) mainScrollPane: IonContent;

  constructor(
    public pageProgressService: PageProgressService,
    public sessionService: SessionService,
    private _shellService: ShellService,
  ) {}

  ngOnInit() {
    this.mainScrollPane.getScrollElement().then((element: HTMLElement) =>
      this._shellService.setMainContent(element)
    );
  }

  back(): void {
    // this._location.back();
  }

}
