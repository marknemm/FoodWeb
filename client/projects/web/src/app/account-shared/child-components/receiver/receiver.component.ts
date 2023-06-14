import { Component, Input, OnInit } from '@angular/core';
import { Receiver } from '~shared';
import { ReceiverForm, ReceiverFormAdapter } from '~web/account-shared/services/receiver-form-adapter/receiver-form-adapter.service';
import { FormFieldProviders, FormFieldService  } from '~web/forms';

@Component({
  selector: 'foodweb-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.scss'],
  providers: [FormFieldProviders]
})
export class ReceiverComponent implements OnInit {

  @Input() editable = false;
  @Input() get value(): Receiver          { return this._receiverFormAdapter.toModel(this.receiverForm.value); }
           set value(receiver: Receiver)  { this.receiverForm.patchValue(
                                              this._receiverFormAdapter.toViewModel(receiver), { emitEvent: false }); }

  constructor(
    private _formFieldService: FormFieldService<ReceiverForm>,
    private _receiverFormAdapter: ReceiverFormAdapter,
  ) {}

  get receiverForm(): ReceiverForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => this._receiverFormAdapter.toForm()
    });
  }

}
