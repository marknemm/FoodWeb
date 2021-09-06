import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortNum'
})
export class ShortNumPipe implements PipeTransform {

  transform(value: string | number): string {
    let num: number = (typeof value === 'string')
      ? parseInt(value, 10)
      : value;

    // Is number less than 1000?
    num = Math.round(num);
    if (num < 1000) {
      return `${num}`;
    }

    // Is number in thousands?
    num = (num / 1000);
    if (num < 1000) {
      return `${Math.floor(num)}K`;
    }

    // Is number in millions?
    num = (num / 1000);
    if (num < 1000) {
      return `${Math.floor(num)}M`
    }

    // Is number in billions?
    num = (num / 1000);
    if (num < 1000) {
      return `${Math.floor(num)}B`
    }

    // Is number in trillions?
    num = (num / 1000);
    return `${Math.floor(num)}T`
  }

}
