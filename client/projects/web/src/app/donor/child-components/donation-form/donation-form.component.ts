import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConstantsService } from '~web/shared/constants/constants.service';

@Component({
  selector: 'food-web-donation-form',
  templateUrl: './donation-form.component.html',
  styleUrls: ['./donation-form.component.scss']
})
export class DonationFormComponent implements OnInit {

  @Input() formGroup: FormGroup;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public constantsService: ConstantsService
  ) {}

  ngOnInit() {}

}
