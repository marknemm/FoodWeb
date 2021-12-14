import { Component, Input, OnInit } from '@angular/core';
import { Receiver } from '~shared';
import { ReceiverForm } from '~web/account-shared/forms/receiver.form';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.scss'],
  providers: [FormFieldService]
})
export class ReceiverComponent implements OnInit {

  @Input() editable = false;
  @Input() get value(): Receiver         { return this._formFieldService.value; }
           set value(receiver: Receiver) { this._formFieldService.valueIn(receiver); }

  constructor(
    private _formFieldService: FormFieldService<ReceiverForm>
  ) {}

  get receiverForm(): ReceiverForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => new ReceiverForm()
    });
  }

}
