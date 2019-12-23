import { TypedFormGroup } from '~web/data-structure/typed-form-group';
import { MapOptions } from '~web/map/map';

export class MapOptionsForm extends TypedFormGroup<MapOptions> {

  constructor(options?: Partial<MapOptions>) {
    super({
      displayRouteToDonor: true,
      displayRouteToReceiver: true,
      useVolunteerCurrentPos: false
    });
    if (options) {
      this.patchValue(options);
    }
  }
}
