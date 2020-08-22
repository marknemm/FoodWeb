import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';

@Component({
  selector: 'foodweb-progress-indicator',
  templateUrl: './progress-indicator.component.html',
  styleUrls: ['./progress-indicator.component.scss']
})
export class ProgressIndicatorComponent implements OnInit, OnChanges {

  @Input() backdropColor = 'lightgray';
  @Input() blocking = false;
  @Input() color = 'primary';
  @Input() diameter = 100;
  @Input() excludeBackdrop = false;
  @Input() trigger = false;
  @Input() value: number;

  private _progressBarMode: ProgressBarMode = 'indeterminate';

  constructor() {}

  get progressBarMode(): ProgressBarMode {
    return this._progressBarMode;
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.color && !this.color) {
      this.color = 'primary';
    }

    if (changes.value) {
      this._progressBarMode = (this.value != null) ? 'determinate' : 'indeterminate';
    }
  }

}
