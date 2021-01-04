import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { Convert } from '~web/component-decorators';

@Component({
  selector: 'foodweb-progress-indicator',
  templateUrl: './progress-indicator.component.html',
  styleUrls: ['./progress-indicator.component.scss']
})
export class ProgressIndicatorComponent implements OnInit, OnChanges {

  @Input() backdropColor = 'rgba(211, 211, 211, .5)';
  @Convert()
  @Input() blocking: boolean = false;
  @Input() color = 'primary';
  @Convert()
  @Input() diameter: number = 100;
  @Convert()
  @Input() excludeBackdrop: boolean = false;
  @Convert()
  @Input() strokeWidth: number;
  @Convert()
  @Input() trigger: boolean = false;
  @Convert()
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
