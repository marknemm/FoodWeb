import { TFormGroup } from '~web/data-structure/t-form-group';
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
