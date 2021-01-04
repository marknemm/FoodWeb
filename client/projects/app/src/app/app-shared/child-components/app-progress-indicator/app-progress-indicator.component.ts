import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Convert } from '~web/component-decorators';

@Component({
  selector: 'foodweb-app-progress-indicator',
  templateUrl: './app-progress-indicator.component.html',
  styleUrls: ['./app-progress-indicator.component.scss']
})
export class AppProgressIndicatorComponent implements OnInit {

  @Input() backdropColor = 'rgba(211, 211, 211, .5)';
  @Convert()
  @Input() blocking: boolean = false;
  @Input() color: string;
  @Convert()
  @Input() diameter: number = 100;
  @Convert()
  @Input() excludeBackdrop: boolean = false;
  @Convert()
  @Input() trigger: boolean = false;
  @Convert()
  @Input() value: number = 0;

  @HostBinding() readonly class = 'app-progress-indicator';

  constructor() {}

  get showBackdrop(): boolean {
    return (this.showProgressSpinner && !this.excludeBackdrop);
  }

  get showProgressBar(): boolean {
    return (!this.blocking && this.trigger);
  }

  get showProgressSpinner(): boolean {
    return (this.blocking && this.trigger);
  }

  ngOnInit() {}

  /**
   * Catch tap events in backdrop.
   */
  onProgressOverlayTap(): void {}

}
