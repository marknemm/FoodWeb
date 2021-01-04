import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { AppBackService } from '~app/app-shared/services/app-back/app-back.service';
import { AppTabsService } from '~app/app-shared/services/app-tabs/app-tabs.service';
import { AccountCreationFormBaseComponent } from '~web/account-shared/child-components/account-creation-form/account-creation-form.base.component';
import { FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-app-account-creation-form',
  templateUrl: './app-account-creation-form.component.html',
  styleUrls: ['./app-account-creation-form.component.scss'],
  providers: [formProvider(AppAccountCreationFormComponent), AppTabsService]
})
export class AppAccountCreationFormComponent extends AccountCreationFormBaseComponent implements OnInit {

  constructor(
    public tabsService: AppTabsService,
    protected _activatedRoute: ActivatedRoute,
    private _backService: AppBackService,
    private _routerExt: RouterExtensions,
    formHelperService: FormHelperService,
  ) {
    super(_activatedRoute, _routerExt.router, formHelperService);
  }

  ngOnInit() {
    super.ngOnInit();
    this._backService.overrideBackUntil(this._destroy$).subscribe(
      () => this._androidBackOverride()
    );
  }

  backToAccountTypeSel(): void {
    this._routerExt.navigate(['..'], { relativeTo: this._activatedRoute });
  }

  backToLoginPage(): void {
    this._routerExt.navigate(['login']);
  }

  /**
   * Override the behavior or the Android system back button so that previously visted tabs
   * are navigated to when page back is executed.
   *
   * NOTE: On iOS, the action bar back button should be collapsed/hidden on this page.
   */
  private _androidBackOverride(): void {
    if (this.tabsService.tabIdxHistoryLength) {
      this.tabsService.tabHistoryBack();
    } else if (this.accountType) {
      this.backToAccountTypeSel();
    } else {
      this.backToLoginPage();
    }
  }
}
