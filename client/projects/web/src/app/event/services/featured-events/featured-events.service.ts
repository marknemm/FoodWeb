import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FeaturedEvent } from '~web/event/featured-event';
export { FeaturedEvent };

@Injectable({
  providedIn: 'root'
})
export class FeaturedEventsService {

  private readonly _featuredEvents: FeaturedEvent[] = [
    {
      date: 'Monday, February 10',
      day: 10,
      description: 'Signup for our next volunteer training at the <strong>Hindu Cultural Society</strong>',
      title: 'Volunteer Driver Training',
      location: '1595 N. French Road, Getzville, NY 14068',
      showUntil: new Date('2020-02-10T19:30:00.000Z'),
      signupCompleteMsg: 'Signup Successful - We look forward to seeing you at the training!',
      signupTitle: 'Training Signup',
      time: '6:30 to 7:30 PM',
    },
    {
      date: 'Thursday, March 12',
      day: 12,
      description: 'Signup for our next volunteer training at <strong>Hodgson Russ</strong>',
      title: 'Volunteer Driver Training',
      location: '140 Pearl Street, Buffalo, NY 14202',
      showUntil: new Date('2020-03-12T19:30:00.000Z'),
      signupCompleteMsg: 'Signup Successful - We look forward to seeing you at the training!',
      signupTitle: 'Training Signup',
      time: '6:30 to 7:30 PM',
    },
    {
      date: 'Monday, April 6',
      day: 6,
      description: 'Signup for our next volunteer training at <strong>Hodgson Russ</strong>',
      title: 'Volunteer Driver Training',
      location: '140 Pearl Street, Buffalo, NY 14202',
      showUntil: new Date('2020-04-06T19:00:00.000Z'),
      signupCompleteMsg: 'Signup Successful - We look forward to seeing you at the training!',
      signupTitle: 'Training Signup',
      time: '6:00 to 7:00 PM',
    },
    {
      date: 'Monday, May 12',
      day: 12,
      description: 'Signup for our next volunteer training at the <strong>Hindu Cultural Society</strong>',
      title: 'Volunteer Driver Training',
      location: '1595 N. French Road, Getzville, NY 14068',
      showUntil: new Date('2020-05-12T19:00:00.000Z'),
      signupCompleteMsg: 'Signup Successful - We look forward to seeing you at the training!',
      signupTitle: 'Training Signup',
      time: '6:00 to 7:00 PM',
    },
    {
      date: 'Monday, June 8',
      day: 8,
      description: 'Signup for our next volunteer training at <strong>Hodgson Russ</strong>',
      title: 'Volunteer Driver Training',
      location: '140 Pearl Street, Buffalo, NY 14202',
      showUntil: new Date('2020-06-08T18:30:00.000Z'),
      signupCompleteMsg: 'Signup Successful - We look forward to seeing you at the training!',
      signupTitle: 'Training Signup',
      time: '5:30 to 6:30 PM',
    },
  ];

  constructor() {}

  getNextFeaturedEvent(): Observable<FeaturedEvent> {
    return of(this._filterExpiredEvents()[0]);
  }

  getFeaturedEvents(): Observable<FeaturedEvent[]> {
    return of(this._filterExpiredEvents());
  }

  private _filterExpiredEvents(): FeaturedEvent[] {
    return this._featuredEvents.filter((event: FeaturedEvent) => event.showUntil > new Date());
  }
}
