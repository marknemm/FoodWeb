import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormFieldService } from '~web/forms';

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

  get formControl(): FormControl<string> {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl();
  }
}
