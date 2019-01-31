import { Component, OnInit, Input } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material';

@Component({
  selector: 'food-web-progress-indicator',
  templateUrl: './progress-indicator.component.html',
  styleUrls: ['./progress-indicator.component.scss']
})
export class ProgressIndicatorComponent implements OnInit {

  @Input() backdropColor = 'lightgray';
  @Input() backdropOpacity = 0.5;
  @Input() backdropVisible = true;
  @Input() blocking = false;
  @Input() color = 'primary';
  @Input() diameter = 100;
  @Input() mode: ProgressSpinnerMode = 'indeterminate';
  @Input() strokeWidth = 5;
  @Input() trigger = false;
  @Input() value: number;

  constructor() {}

  ngOnInit() {}

}
