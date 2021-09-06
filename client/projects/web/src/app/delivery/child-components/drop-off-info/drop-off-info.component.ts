import { Component, Input } from '@angular/core';
import { Donation } from '~shared';

@Component({
  selector: 'foodweb-drop-off-info',
  templateUrl: './drop-off-info.component.html',
  styleUrls: ['./drop-off-info.component.scss'],
})
export class DropOffInfoComponent {

  @Input() donation: Donation;

}
