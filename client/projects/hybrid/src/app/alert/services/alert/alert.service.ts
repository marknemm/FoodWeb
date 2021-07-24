import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { AlertButton, OverlayEventDetail, ToastButton } from '@ionic/core';
import { from, Observable } from 'rxjs';
import { Alert, AlertDisplayer } from '~web/alert/interfaces/alert';
export * from '~web/alert/interfaces/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService extends AlertDisplayer {

  constructor(
    protected _alertController: AlertController,
    protected _toastController: ToastController
  ) { super(); }

  displayAlert(alert: Alert): Observable<boolean> {
    alert.cssClass = alert.cssClass ?? '';
    const resultPromsie: Promise<boolean> = alert.blocking ?
      this._presentBlockingAlert(alert) :
      this._presentNonBlockingAlert(alert);
    return from(resultPromsie);
  }

  private async _presentBlockingAlert(alert: Alert): Promise<boolean> {
    const buttons: AlertButton[] = this._genAlertButtons(alert, 'alert');
    if (buttons.length === 0) {
      buttons.push({
        text: 'Close',
        role: 'cancel',
        cssClass: 'alert-close'
      });
    }
    const alertElement: HTMLIonAlertElement = await this._alertController.create({
      backdropDismiss: !alert.disableBackdropClose,
      buttons,
      cssClass: `${alert.level} ${alert.cssClass}`,
      header: alert.title,
      keyboardClose: true,
      message: alert.message,
      translucent: true,
    });
    await alertElement.present();
    return alertElement.onDidDismiss().then((event: OverlayEventDetail<any>) => {
      alertElement.remove(); // Ensure element is not left in DOM.
      return (event.role === 'confirm');
    });
  }

  private async _presentNonBlockingAlert(alert: Alert): Promise<boolean> {
    const buttons: ToastButton[] = this._genAlertButtons(alert, 'toast');
    const toastElement: HTMLIonToastElement = await this._toastController.create({
      buttons,
      cssClass: `${alert.level} ${alert.cssClass}`,
      duration: 5000,
      header: alert.title,
      message: alert.message,
      translucent: true,
    });
    if (buttons.length === 0) {
      toastElement.onclick = () => toastElement.dismiss();
    }
    await toastElement.present();
    return toastElement.onDidDismiss().then((event: OverlayEventDetail<any>) => {
      toastElement.remove(); // Ensure element is not left in DOM.
      return (event.role === 'confirm');
    });
  }

  private _genAlertButtons(alert: Alert, buttonType: 'alert' | 'toast'): (ToastButton & AlertButton)[] {
    const buttons: (ToastButton & AlertButton)[] = [];

    if (alert.cancelButton) {
      buttons.push({
        text: alert.cancelButton,
        role: 'cancel',
        cssClass: `${buttonType}-cancel`
      });
    }

    if (alert.confirmButton) {
      buttons.push({
        text: alert.confirmButton,
        role: 'confirm',
        cssClass: `${buttonType}-confirm`
      });
    }

    return buttons;
  }
}
