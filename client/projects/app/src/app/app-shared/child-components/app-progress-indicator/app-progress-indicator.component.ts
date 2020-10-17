import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { isIOS } from '@nativescript/core';

@Component({
  selector: 'foodweb-app-progress-indicator',
  templateUrl: './app-progress-indicator.component.html',
  styleUrls: ['./app-progress-indicator.component.scss']
})
export class AppProgressIndicatorComponent implements OnInit {

  @Input() backdropColor = 'rgba(211, 211, 211, .5)';
  @Input() blocking = false;
  @Input() color: string;
  @Input() diameter = 100;
  @Input() excludeBackdrop = false;
  @Input() trigger = false;
  @Input() value = 0;

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
