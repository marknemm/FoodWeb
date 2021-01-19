import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBaseComponent, FormHelperService, formProvider, TFormControl } from '~web/forms';

@Component({
  selector: 'foodweb-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  providers: formProvider(SearchBarComponent)
})
export class SearchBarComponent extends FormBaseComponent<string> implements OnInit {

  @Input() placeholder = 'Search...';

  @Output() search = new EventEmitter<string>();

  constructor(
    formHelperService: FormHelperService
  ) {
    super(() => new TFormControl<string>(), formHelperService);
  }

  ngOnInit() {}
}
