import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TFormGroup } from '~web/data-structure/t-form-group';

@Component({
  selector: 'foodweb-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SearchBarComponent), multi: true }
  ]
})
export class SearchBarComponent implements OnInit, ControlValueAccessor {

  @Input() placeholder = 'Search...';

  @Output() search = new EventEmitter<string>();

  readonly searchForm = new TFormGroup<{ searchQuery: string }>({
    searchQuery: ''
  });

  private _onChangeCb: (searchQuery: string) => void = () => {};
  private _onTouchedCb: () => void = () => {};

  constructor() {}

  get onChangeCb(): (searchQuery: string) => void {
    return this._onChangeCb;
  }

  get onTouchedCb(): () => void {
    return this._onTouchedCb;
  }

  ngOnInit() {}

  writeValue(searchQuery: string): void {
    this.searchForm.patchValue({ searchQuery });
  }

  registerOnChange(onChangeCb: (searchQuery: string) => void): void {
    this._onChangeCb = onChangeCb;
  }

  registerOnTouched(onTouchedCb: () => void): void {
    this._onTouchedCb = onTouchedCb;
  }

  setDisabledState?(isDisabled: boolean): void {
    (isDisabled) ? this.searchForm.disable() : this.searchForm.enable();
  }

}
