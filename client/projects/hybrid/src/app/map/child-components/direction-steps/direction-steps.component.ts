import { Component } from '@angular/core';
import { DirectionStepsComponent as WebDirectionStepsComponent } from '~web/map/child-components/direction-steps/direction-steps.component';

@Component({
  selector: 'foodweb-hybrid-direction-steps',
  templateUrl: '../../../../../../web/src/app/map/child-components/direction-steps/direction-steps.component.html',
  styleUrls: ['./direction-steps.component.scss']
})
export class DirectionStepsComponent extends WebDirectionStepsComponent {}
