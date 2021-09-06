import { Component } from '@angular/core';
import { DropOffInfoComponent as WebDropOffInfoComponent } from '~web/delivery/child-components/drop-off-info/drop-off-info.component';

@Component({
  selector: 'foodweb-hybrid-drop-off-info',
  templateUrl: './drop-off-info.component.html',
  styleUrls: ['./drop-off-info.component.scss']
})
export class DropOffInfoComponent extends WebDropOffInfoComponent {}
