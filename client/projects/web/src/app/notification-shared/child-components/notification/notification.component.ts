import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Notification } from '~shared';

@Component({
  selector: 'foodweb-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {

  @Input() notification: Notification;
  @Input() max2Lines = false;

  @Output() flag = new EventEmitter<Notification>();
  @Output() select = new EventEmitter<Notification>();

  handleFlaggedIndicatorClick(event: MouseEvent): void {
    event.stopPropagation();
    this.flag.emit(this.notification);
  }

  shouldFadeBottom(elem: HTMLElement): boolean {
    return (this.max2Lines && elem.scrollHeight > elem.clientHeight);
  }

}
