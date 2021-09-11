import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FormFieldService, TFormControl } from '~web/forms';

@Component({
  selector: 'foodweb-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss'],
  providers: [FormFieldService]
})
export class UsernameComponent implements OnInit {

  @Input() editable = false;
  @Input() get value(): string         { return this._formFieldService.value; }
           set value(username: string) { this._formFieldService.valueIn(username); }

  @HostBinding()
  readonly class = 'foodweb-username';

  constructor(
    private _formFieldService: FormFieldService<string>
  ) {}

  get formControl(): TFormControl<string> {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl();
  }
}
