import { Component, Input } from '@angular/core';

@Component({
  selector: 'foodweb-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  @Input() attributions: string[] = [];

  readonly year = new Date().getFullYear();

}
