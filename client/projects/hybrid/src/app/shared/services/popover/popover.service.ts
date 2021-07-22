import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ComponentRef, PopoverOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class PopoverService {

  constructor(
    public popoverController: PopoverController
  ) {}

  /**
   * Shows a popover menu, which shall be attached to a menu button that has been interacted with via a given event.
   * @param component The component that shall be used for the popover menu.
   * @param event The menu button interaction (click/tap) event.
   * @param componentProps The override popover options to merge with the default ones.
   * @returns A promise that resolves to the shown popover menu element.
   */
  async showMenu<T extends ComponentRef>(
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
    const popover: HTMLIonPopoverElement = await this.popoverController.create(opts);
    await popover.present();
    return popover;
  }
}
