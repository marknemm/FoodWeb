import express = require('express');
import { Request, Response } from 'express';
import { UpdateDiff } from '../interfaces/update-diff';
import { NotificationEntity } from '../entity/notification.entity';
import { handleError } from '../middlewares/response-error.middleware';
import { ensureSessionActive } from '../middlewares/session.middleware';
import { genListResponse } from '../helpers/list-response';
import { sseManager } from '../helpers/sse-manager';
import { readNotifications, NotificationsQueryResult, readUnseenNotificationsCount } from '../services/read-notifications';
import { updateSeenNotifications, updateNotification } from '../services/save-notification';
import { NotificationReadRequest } from '../../../shared/src/interfaces/notification/notification-read-request';
import { NotificationUpdateRequest } from '../../../shared/src/interfaces/notification/notification-update-request';
import { LastSeenNotificationUpdateRequest } from '../../../shared/src/interfaces/notification/last-seen-notification-update-request';
import { Account } from '../../../shared/src/interfaces/account/account';
import { ServerSideEventType } from '../../../shared/src/interfaces/server-side-event/server-side-event';

const router = express.Router();

router.get('/', ensureSessionActive, (req: Request, res: Response) => {
  const readRequest: NotificationReadRequest = req.query;
  readNotifications(readRequest, req.session.account)
    .then(({ notifications, totalCount }: NotificationsQueryResult) =>
      res.send(genListResponse(notifications, totalCount, readRequest))
    )
    .catch(handleError.bind(this, res));
});

router.put('/lastSeenNotification', ensureSessionActive, (req: Request, res: Response) => {
  const updateReq: LastSeenNotificationUpdateRequest = req.body;
  updateSeenNotifications(req.session.account, updateReq.lastSeenNotificationId)
    .then((lastSeenNotificationId: number) => {
      req.session.account.lastSeenNotificationId = lastSeenNotificationId;
      res.send();
    })
    .catch(handleError.bind(this, res));
});

router.put('/', ensureSessionActive, (req: Request, res: Response) => {
  const updateReq: NotificationUpdateRequest = req.body;
  updateNotification(req.session.account, updateReq.notification)
    .then((notificationDiff: UpdateDiff<NotificationEntity>) => res.send(notificationDiff.new))
    .catch(handleError.bind(this, res));
});

sseManager.onConnect(async (account: Account) => {
  const unseenNotificationsCount: number = await readUnseenNotificationsCount(account);
  sseManager.sendEvent(account, {
    id: ServerSideEventType.NotificationsAvailable,
    data: { unseenNotificationsCount }
  });
});

module.exports = router;
