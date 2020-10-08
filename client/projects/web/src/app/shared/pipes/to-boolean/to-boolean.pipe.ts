import { Pipe, PipeTransform } from '@angular/core';
import _ from '~lodash-mixins';

@Pipe({
  name: 'toBoolean'
})
export class ToBooleanPipe implements PipeTransform {

  /**
   * Transforms a given boolean input or string value to a boolean.
   * @param input The boolean input to transform.
   * @return The boolean transformation result.
   */
  transform(input: BooleanInput | string): boolean {
    return _.toBoolean(input);
  }
}
