import { Component, Input, OnInit } from '@angular/core';
import { ReceiverForm } from '~web/account/receiver.form';

@Component({
  selector: 'food-web-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.scss']
})
export class ReceiverComponent implements OnInit {

  @Input() editing = false;
  @Input() formGroup: ReceiverForm;

  constructor() {}

  ngOnInit() {
    this.formGroup = this.formGroup ? this.formGroup : new ReceiverForm();
  }

}
