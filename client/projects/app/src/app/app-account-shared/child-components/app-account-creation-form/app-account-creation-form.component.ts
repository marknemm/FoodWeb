import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { Focusable } from '~app/app-shared/interfaces/focusable';
import { AppBackService } from '~app/app-shared/services/app-back/app-back.service';
import { AccountCreationFormBaseComponent } from '~web/account-shared/child-components/account-creation-form/account-creation-form.base.component';

@Component({
  selector: 'foodweb-app-account-creation-form',
  templateUrl: './app-account-creation-form.component.html',
  styleUrls: ['./app-account-creation-form.component.scss']
})
export class AppAccountCreationFormComponent extends AccountCreationFormBaseComponent implements OnInit {

  private _tabIdx = 0;
  private _tabIdxHistory: number[] = [];

  constructor(
    protected _activatedRoute: ActivatedRoute,
    private _backService: AppBackService,
    private _routerExt: RouterExtensions,
  ) {
    super(_activatedRoute, _routerExt.router);
  }

  ngOnInit() {
    super.ngOnInit();
    this._backService.overrideBackUntil(this._destroy$).subscribe(
      () => this._androidBackOverride()
    );
  }

  get tabIdx(): number {
    return this._tabIdx;
  }

  nextTab(): void {
    this.toTab(this._tabIdx + 1);
  }

  nextTabAndFocus(focusable: Focusable): void {
    this.nextTab();
    focusable.focus();
  }

  prevTab(): void {
    this.toTab(this._tabIdx - 1);
  }

  toTab(tabIdx: number): void {
    if (this.tabIdx !== tabIdx && tabIdx >= 0) {
      this._tabIdxHistory.push(this._tabIdx);
      this._tabIdx = tabIdx;
    }
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
    if (this._tabIdxHistory.length) {
      this._tabIdx = this._tabIdxHistory.pop();
    } else if (this.accountType) {
      this.backToAccountTypeSel();
    } else {
      this.backToLoginPage();
    }
  }
}
