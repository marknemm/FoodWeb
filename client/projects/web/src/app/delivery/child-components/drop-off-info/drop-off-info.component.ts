import { Component, Input, OnInit } from '@angular/core';
import { Donation } from '~shared';

@Component({
  selector: 'food-web-drop-off-info',
  templateUrl: './drop-off-info.component.html',
  styleUrls: ['./drop-off-info.component.scss'],
})
export class DropOffInfoComponent implements OnInit {

  @Input() donation: Donation;

  constructor() {}

  ngOnInit() {}

}
