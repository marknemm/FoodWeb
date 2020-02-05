import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatEventLocation'
})
export class FormatEventLocationPipe implements PipeTransform {

  /**
   * Formats a given event location string for optimal display.
   * @param eventLocation The raw event location that is to be formatted for display.
   * @return The formatted event location.
   */
  transform(eventLocation: string): string {
    return eventLocation.replace(/<[^>]*>/g, '').replace(',', '<br>');
  }

}
