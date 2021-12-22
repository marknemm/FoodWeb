import { Pipe, PipeTransform } from '@angular/core';
import { range } from 'lodash-es';

@Pipe({
  name: 'range'
})
export class RangePipe implements PipeTransform {

  transform(start: number, end: number, step = 1): unknown {
    return range(start, end, step);
  }

}
