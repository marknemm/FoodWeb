import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PageProgressService as WebPageProgressService } from '~web/shared/services/page-progress/page-progress.service';

@Injectable({
  providedIn: 'root'
})
export class PageProgressService extends WebPageProgressService {

  private _loadingElement: HTMLIonLoadingElement;

  constructor(
    protected _router: Router,
    private _loadingController: LoadingController,
  ) {
    super(_router);
  }

  activate(blocking: boolean): void {
    super.activate(blocking);
    if (blocking) {
      this._showBlockingLoad();
    }
  }

  deactivate(): void {
    this._dismissBlockingLoad();
    super.deactivate();
  }

  /**
   * Shows a native blocking load spinner.
   * @return A promise that resolves once the spinner is fully shown.
   */
  private async _showBlockingLoad(): Promise<void> {
    await this._dismissBlockingLoad();
    this._loadingElement = await this._loadingController.create(
      { showBackdrop: !this.excludeBackdrop }
    );
    await this._loadingElement.present();

    // Check after presenting the blocking load spinner if a deactivation occurred during async create/present.
    if (!this.trigger) {
      this._dismissBlockingLoad();
    }
  }

  /**
   * Dismisses any native blocking load spinner that is currently showing.
   * @return A promise that resolves once the spinner is fully dismissed.
   */
  private async _dismissBlockingLoad(): Promise<void> {
    if (this._loadingElement) {
      const elementToDismiss: HTMLIonLoadingElement = this._loadingElement;
      await elementToDismiss.dismiss();
      elementToDismiss.remove();
    }
  }
}
