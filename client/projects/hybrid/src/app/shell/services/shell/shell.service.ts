import { Injectable } from '@angular/core';
import { IonMenu } from '@ionic/angular';
import { ShellService as WebShellService } from '~web/shell/services/shell/shell.service';

@Injectable({
  providedIn: 'root'
})
export class ShellService extends WebShellService {

  private _leftNav: IonMenu;

  setLeftNav(leftNav: IonMenu): void {
    this._leftNav = leftNav;
    this._leftNav.ionWillOpen.subscribe(() => this._leftNavOpened = true);
    this._leftNav.ionWillClose.subscribe(() => this._leftNavOpened = false);
  }

  protected _setLeftNavOpened(opened: boolean): void {
    this._leftNavOpened = opened;
    (this._leftNavOpened)
      ? this._leftNav.open(true)
      : this._leftNav.close(true);
    this._leftNavOpenedChanged.next(opened);
  }

  refreshLeftNavState(): 'side' | 'over' {
    this._setLeftNavOpened(false);
    return 'over';
  }
}
