import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../services/notification/notification.service';
import { Notification } from '../../../../../shared/src/interfaces/notification/notification';
import { ListResponse } from '../../../../../shared/src/interfaces/list-response';

@Component({
  selector: 'food-web-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  @Input() hideHeader = false;

  notifications: Notification[];
  totalCount = 0;

  private _destroy$ = new Subject();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationService
  ) {}

  ngOnInit() {
    this._notificationService.listenNotificationsQueryChange(this._activatedRoute).pipe(
      takeUntil(this._destroy$)
    ).subscribe((response: ListResponse<Notification>) => {
      this.notifications = response.list;
      this.totalCount = response.totalCount;
    });
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

}
