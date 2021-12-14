import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormFieldService, TFormControl } from '~web/forms';

@Component({
  selector: 'foodweb-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  providers: [FormFieldService]
})
export class SearchBarComponent implements OnInit {

  @Input() placeholder = 'Search...';

  @Output() search = new EventEmitter<string>();

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
