import { Component, OnInit } from '@angular/core';
import { faCalendarPlus, faGifts } from '@fortawesome/free-solid-svg-icons';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { LeftNavService } from '~web/shell/services/left-nav/left-nav.service';

@Component({
  selector: 'foodweb-admin-left-nav-items',
  templateUrl: './admin-left-nav-items.component.html',
  styleUrls: ['./admin-left-nav-items.component.scss'],
})
export class AdminLeftNavItemsComponent implements OnInit {

  faCalendarPlus = faCalendarPlus;
  faGifts = faGifts;

  constructor(
    public constantsService: ConstantsService,
    private _leftNavService: LeftNavService
  ) {}

  ngOnInit() {
    this._leftNavService.mode = 'side';
    this._leftNavService.toggle();
  }

  _onNavigate(): void {
    if (this._leftNavService.mode === 'over') {
      this._leftNavService.toggle();
    }
  }

}
