import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ComponentRef, PopoverOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class PopoverService {

  private _popovers = new Map<ComponentRef, HTMLIonPopoverElement>();

  constructor(
    public popoverController: PopoverController
  ) {}

  /**
   * Presents a popover menu, which shall be attached to a menu button that has been interacted with via a given event.
   * @param component The component that shall be placed within the popover menu.
   * @param event The menu button interaction (click/tap) event.
   * @param componentProps The override popover options to merge with the default ones.
   * @returns A promise that resolves to the shown popover menu element.
   */
  async present<T extends ComponentRef>(
    component: T,
    event?: Event,
    overrideOpts: Partial<PopoverOptions<ComponentRef>> = {}
  ): Promise<HTMLIonPopoverElement> {
    const popover = (this._popovers.has(component))
      ? this._popovers.get(component)
      : await this._createPopoverMenu(component, event, overrideOpts);
    await popover.present();
    return popover;
  }

  /**
   * Dismisses a popover menu that contains a given component.
   * @param component The component contained within the popover that shall be dismissed.
   * @returns A promise that resolves once the operation completes.
   */
  async dismiss<T extends ComponentRef>(component: T): Promise<void> {
    if (this._popovers.has(component)) {
      const popover = this._popovers.get(component);
      await popover.dismiss();
      popover.remove();
      this._popovers.delete(component);
    }
  }

  /**
   * Creates a popover menu containing a given component.
   * @param component The component that shall be placed within popover menu.
   * @param event The menu button interaction (click/tap) event.
   * @param componentProps The override popover options to merge with the default ones.
   * @returns A promise that resolves to the shown popover menu element.
   */
  private async _createPopoverMenu<T extends ComponentRef>(
    component: T,
    event?: Event,
    overrideOpts: Partial<PopoverOptions<ComponentRef>> = {}
  ): Promise<HTMLIonPopoverElement> {
    const opts: PopoverOptions<ComponentRef> = Object.assign({
      component,
      event,
      translucent: true,
    }, overrideOpts);
    opts.componentProps = opts.componentProps ?? {};
    opts.componentProps.isMenu = true;
    const popover = await this.popoverController.create(opts);
    this._popovers.set(component, popover);
    popover.onWillDismiss().then(() => {
      popover.remove();
      this._popovers.delete(component);
    });
    return popover;
  }
}
