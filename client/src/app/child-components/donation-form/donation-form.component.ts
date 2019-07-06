import { Component, OnInit, Input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ConstantsService } from '../../services/constants/constants.service';

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
