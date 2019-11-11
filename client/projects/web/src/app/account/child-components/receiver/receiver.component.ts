import { Component, OnInit, Input, Optional } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { FormHelperService } from '~web/shared';

import { ReceiverForm } from '~web/account/forms/receiver.form';

@Component({
  selector: 'food-web-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.scss']
})
export class ReceiverComponent implements OnInit {

  @Input() editing = false;
  @Input() formGroup: ReceiverForm;
  @Input() formGroupName: string;

  constructor(
    @Optional() private _formGroupDirective: FormGroupDirective,
    private _formHelper: FormHelperService
  ) {}

  ngOnInit() {
    this.formGroup = <ReceiverForm>this._formHelper.deriveFormGroup(this.formGroup, this.formGroupName, this._formGroupDirective);
  }

}
