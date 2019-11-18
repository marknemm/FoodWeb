import { Component, OnInit } from '@angular/core';
import { faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'food-web-donate-menu',
  templateUrl: './donate-menu.component.html',
  styleUrls: ['./donate-menu.component.scss'],
})
export class DonateMenuComponent implements OnInit {

  faHandHoldingHeart = faHandHoldingHeart;

  constructor() {}

  ngOnInit() {}
}
