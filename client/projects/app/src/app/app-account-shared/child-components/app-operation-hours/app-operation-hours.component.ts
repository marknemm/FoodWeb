import { Component, OnInit } from '@angular/core';
import { OperationHoursBaseComponent } from '~web/account-shared/child-components/operation-hours/operation-hours.base.component';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-app-operation-hours',
  templateUrl: './app-operation-hours.component.html',
  styleUrls: ['./app-operation-hours.component.scss']
})
export class AppOperationHoursComponent extends OperationHoursBaseComponent implements OnInit {

  constructor(
    public constantsService: ConstantsService
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
