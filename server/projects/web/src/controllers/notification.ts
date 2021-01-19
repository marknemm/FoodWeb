import express = require('express');
import { Request, Response } from 'express';
import { NotificationEntity } from '~entity';
import { LastSeenNotificationUpdateRequest, ListResponse, NotificationReadRequest, NotificationUpdateRequest } from '~shared';
import { UpdateDiff } from '~web/helpers/misc/update-diff';
import { genErrorResponse } from '~web/middlewares/response-error.middleware';
import { ensureSessionActive } from '~web/middlewares/session.middleware';
import { readNotifications } from '~web/services/notification/read-notifications';
import { updateNotification, updateSeenNotifications } from '~web/services/notification/save-notification';

export const router = express.Router();

router.get('/', ensureSessionActive, handleGetNotifications);
export function handleGetNotifications(req: Request, res: Response) {
  const readRequest: NotificationReadRequest = req.query;
  readNotifications(readRequest, req.session.account)
    .then((listRes: ListResponse<NotificationEntity>) => res.send(listRes))
    .catch(genErrorResponse.bind(this, res));
}

router.put('/last-seen-notification', ensureSessionActive, handlePutLastSeenNotification);
export function handlePutLastSeenNotification(req: Request, res: Response) {
  const updateReq: LastSeenNotificationUpdateRequest = req.body;
  updateSeenNotifications(req.session.account, updateReq.lastSeenNotificationId)
    .then((lastSeenNotificationId: number) => {
      req.session.account.lastSeenNotificationId = lastSeenNotificationId;
      res.send();
    })
    .catch(genErrorResponse.bind(this, res));
}

router.put('/', ensureSessionActive, handlePutNotification);
export function handlePutNotification(req: Request, res: Response) {
  const updateReq: NotificationUpdateRequest = req.body;
  updateNotification(req.session.account, updateReq.notification)
    .then((notificationDiff: UpdateDiff<NotificationEntity>) => res.send(notificationDiff.new))
    .catch(genErrorResponse.bind(this, res));
}
