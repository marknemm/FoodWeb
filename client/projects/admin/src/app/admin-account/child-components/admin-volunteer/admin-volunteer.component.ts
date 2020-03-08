import { Component, OnInit } from '@angular/core';
import { VolunteerComponent } from '~web/account/volunteer/volunteer.component';

@Component({
  selector: 'food-web-admin-volunteer',
  templateUrl: './admin-volunteer.component.html',
  styleUrls: ['./admin-volunteer.component.scss'],
})
export class AdminVolunteerComponent extends VolunteerComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
