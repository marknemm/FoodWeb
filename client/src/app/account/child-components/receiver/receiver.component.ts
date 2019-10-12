import { Component, OnInit, Input, Optional } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { ReceiverForm } from '../../forms/receiver.form';
import { FormHelperService } from '../../../shared/services/form-helper/form-helper.service';

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
