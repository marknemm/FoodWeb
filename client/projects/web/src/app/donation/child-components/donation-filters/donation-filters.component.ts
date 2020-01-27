import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DonationFiltersForm, DonationReadRequest } from '~web/donation/forms/donation-filters.form';
import { ConstantsService } from '~web/shared/constants/constants.service';

@Component({
  selector: 'food-web-donation-filters',
  templateUrl: './donation-filters.component.html',
  styleUrls: ['./donation-filters.component.scss'],
})
export class DonationFiltersComponent implements OnInit {

  filtersForm = new DonationFiltersForm();

  @Output() filter = new EventEmitter<DonationReadRequest>();

  constructor(
    public constantsService: ConstantsService,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe((currentFilters: Params) =>
      this.filtersForm.patchValue(currentFilters)
    );
  }

}
