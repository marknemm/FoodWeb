import { Component } from '@angular/core';

@Component({
  selector: 'foodweb-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  readonly year = new Date().getFullYear();

  constructor() {}

}
