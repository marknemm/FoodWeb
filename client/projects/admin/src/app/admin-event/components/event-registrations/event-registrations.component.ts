import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventIdentifierForm } from '~admin/admin-event/event-identifier.form';
import { EventRegistrationsService } from '~admin/admin-event/event-registrations/event-registrations.service';
import { EventRegistration, FeaturedEvent } from '~shared';
import { PageTitleService } from '~web/shared/page-title/page-title.service';
import { TableDataSource } from '~web/table/table-data-source';

@Component({
  selector: 'food-web-event-registrations',
  templateUrl: './event-registrations.component.html',
  styleUrls: ['./event-registrations.component.scss'],
  providers: [DatePipe]
})
export class EventRegistrationsComponent implements OnInit, OnDestroy {

  readonly dateFormat = 'MM/dd/yy';
  readonly timeFormat = 'hh:mm a';

  readonly eventIdentifierForm = new EventIdentifierForm();
  readonly registrationsDataSource = new TableDataSource<EventRegistration>([], [
    { name: 'fullName', visibleName: 'Name' }, 'email', { name: 'phoneNumber', minWidth: '120px' }
  ]);
  readonly registrationsDisplayCols = ['fullName', 'email', 'phoneNumber'];

  private _destory$ = new Subject();
  private _eventIdentifierStrs: string[] = [];
  private _filteredEventIdentifierStrs: string[] = [];
  private _registrationsTableTitle = '';

  constructor(
    public eventRegistrationService: EventRegistrationsService,
    public pageTitleService: PageTitleService,
    private _datePipe: DatePipe
  ) {}

  get filteredEventIdentifierStrs(): Partial<string>[] {
    return this._filteredEventIdentifierStrs;
  }

  get registrationsTableTitle(): string {
    return this._registrationsTableTitle;
  }

  ngOnInit() {
    this._getEventIdentifiers();
    this._filterEventsIdentifiersOnChange();
  }

  private _getEventIdentifiers(): void {
    this.eventRegistrationService.getEventIdentifiers().subscribe(
      (eventIdentifiers: Partial<FeaturedEvent>[]) => {
        this._eventIdentifierStrs = this._toEventIdentifierStrs(eventIdentifiers);
        this.filterEventIdentifiers(this.eventIdentifierForm.get('eventIdentifierStr').value);
      }
    );
  }

  private _toEventIdentifierStrs(eventIdentifiers: Partial<FeaturedEvent>[]): string[] {
    return eventIdentifiers.map((identifier: Partial<FeaturedEvent>) => {
      const dateTimeStr: string = this._datePipe.transform(identifier.date, `${this.dateFormat} -- ${this.timeFormat}`);
      return `${identifier.id}: ${identifier.title} -- ${dateTimeStr}`;
    });
  }

  private _filterEventsIdentifiersOnChange(): void {
    this.eventIdentifierForm.get('eventIdentifierStr').valueChanges.pipe(
      takeUntil(this._destory$)
    ).subscribe(
      this.filterEventIdentifiers.bind(this)
    );
  }

  ngOnDestroy() {
    this._destory$.next();
  }

  getEventRegistrations(): void {
    const eventIdentifierStr = this.eventIdentifierForm.get('eventIdentifierStr').value?.trim();
    if (this._eventIdentifierStrs.indexOf(eventIdentifierStr) >= 0) {
      this._registrationsTableTitle = eventIdentifierStr.split(':').splice(1).join(':');
      this.eventRegistrationService.getEventRegistrations(eventIdentifierStr).subscribe(
        (registrations: EventRegistration[]) => this.registrationsDataSource.data = registrations
      );
    }
  }

  filterEventIdentifiers(filter: string): void {
    if (filter) {
      const lowerFilter: string = filter.toLowerCase();
      this._filteredEventIdentifierStrs = this._eventIdentifierStrs.filter((identifierStr: string) => {
        return identifierStr.toLowerCase().indexOf(lowerFilter) >= 0
      });
    } else {
      this._filteredEventIdentifierStrs = this._eventIdentifierStrs;
    }
  }

}
