import { Component, OnInit, Input } from '@angular/core';
import { ContactInfo } from '~shared';

@Component({
  selector: 'food-web-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  @Input() contactInfo: ContactInfo

  constructor() {}

  ngOnInit() {}

}
