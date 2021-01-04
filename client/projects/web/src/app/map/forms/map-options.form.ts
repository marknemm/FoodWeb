import { TFormGroup } from '~web/forms';
import { MapOptions } from '~web/map/interfaces/map';

export class MapOptionsForm extends TFormGroup<MapOptions> {

  constructor(options?: Partial<MapOptions>) {
    super({
      displayRouteToDonor: true,
      displayRouteToReceiver: true,
      useVolunteerCurrentPos: true
    });
    if (options) {
      this.patchValue(options);
    }
  }
}
