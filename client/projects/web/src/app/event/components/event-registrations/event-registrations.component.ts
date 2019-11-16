import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageTitleService } from '~web/page-title/page-title.service';
import { EventRegistration, ListResponse } from '~shared';

import { EventRegistrationService } from '~web/event-registration/event-registration.service';

@Component({
  selector: 'food-web-event-registrations',
  templateUrl: './event-registrations.component.html',
  styleUrls: ['./event-registrations.component.scss']
})
export class EventRegistrationsComponent implements OnInit {

  readonly registrationsDataSource = new MatTableDataSource<EventRegistration>([]);
  readonly registrationsDisplayCols = ['fullName', 'email', 'phoneNumber'];

  constructor(
    public pageTitleService: PageTitleService,
    public eventRegistrationService: EventRegistrationService
  ) {}

  ngOnInit() {
    this.eventRegistrationService.getEventRegistrations().subscribe(
      (response: ListResponse<EventRegistration>) => {
        this.registrationsDataSource.data = response.list;
      }
    )
  }

}
