import { Pipe, PipeTransform } from '@angular/core';
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

@Pipe({
  name: 'dateFormatter'
})
export class DateFormatterPipe implements PipeTransform {

  transform(value: NgbDateStruct, args?: any): string {
    return this.formatDate(value);
  }

  formatDate(value: NgbDateStruct): string {
    if (value != null) {
      return (value.year.toString() + '-' + value.month.toString() + '-' + value.day.toString());
    }
    return '';
  }

}
