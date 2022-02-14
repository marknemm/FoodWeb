import { Component } from '@angular/core';
import { faCalendarPlus, faGifts } from '@fortawesome/free-solid-svg-icons';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-admin-left-nav-items',
  templateUrl: './admin-left-nav-items.component.html',
  styleUrls: ['./admin-left-nav-items.component.scss'],
})
export class AdminLeftNavItemsComponent {

  faCalendarPlus = faCalendarPlus;
  faGifts = faGifts;

  constructor(
    public constantsService: ConstantsService,
    private _shellService: ShellService
  ) {}

  _onNavigate(): void {
    if (this._shellService.leftNavMode === 'over') {
      this._shellService.toggleLeftNav();
    }
  }

}
