import { Component, OnInit } from '@angular/core';
import { OperationHoursInfoBaseComponent } from '~web/account-shared/child-components/operation-hours-info/operation-hours-info.base.component';

@Component({
  selector: 'foodweb-app-operation-hours-info',
  templateUrl: './app-operation-hours-info.component.html',
  styleUrls: ['./app-operation-hours-info.component.scss']
})
export class AppOperationHoursInfoComponent extends OperationHoursInfoBaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
