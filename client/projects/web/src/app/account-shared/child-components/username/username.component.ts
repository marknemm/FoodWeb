import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormFieldProviders, FormFieldService  } from '~web/forms';

@Component({
  selector: 'foodweb-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss'],
  providers: [FormFieldProviders]
})
export class UsernameComponent implements OnInit {

  @Input() editable = false;
  @Input() get value(): string         { return this._formFieldService.value; }
           set value(username: string) { this.formControl.patchValue(username, { emitEvent: false }); }

  @HostBinding()
  readonly class = 'foodweb-username';

  constructor(
    private _formFieldService: FormFieldService<string>
  ) {}

  get formControl(): FormControl<string> {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl();
  }
}
