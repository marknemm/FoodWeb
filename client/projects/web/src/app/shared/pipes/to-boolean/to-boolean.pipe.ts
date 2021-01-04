import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toBoolean'
})
export class ToBooleanPipe implements PipeTransform {

  /**
   * Transforms a given value to a boolean.
   * If the value is a string containing 'false', then will resolve to false.
   * If the value is anything else, then will resolve to whether or not the value is truthy.
   * @param value The value to transform into a boolean.
   * @return The boolean transformation result.
   */
  transform(value: any): boolean {
    return (typeof value === 'string')
      ? (value !== 'false')
      : !!value;
  }
}
