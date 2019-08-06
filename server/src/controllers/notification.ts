import express = require('express');
import { Request, Response } from 'express';
import { handleError } from '../middlewares/response-error.middleware';
import { ensureSessionActive } from '../middlewares/session.middleware';
import { genListResponse } from '../helpers/list-response';
import { sseManager } from '../helpers/sse-manager';
import { readNotifications, NotificationsQueryResult, readUnseenNotificationsCount } from '../services/read-notifications';
import { NotificationReadRequest } from '../../../shared/src/interfaces/notification/notification-read-request';
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

router.put('/', ensureSessionActive, (req: Request, res: Response) => {
  // TODO: Allow user to un/mark notification as read or flagged.
});

sseManager.onConnect(async (account: Account) => {
  const unseenNotificationsCount: number = await readUnseenNotificationsCount(account);
  sseManager.sendEvent(account, {
    id: ServerSideEventType.NotificationsAvailable,
    data: { unseenNotificationsCount }
  });
});

module.exports = router;
