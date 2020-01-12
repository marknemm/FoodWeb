import express = require('express');
import { Request, Response } from 'express';
import { NotificationEntity } from '../entity/notification.entity';
import { QueryResult } from '../helpers/database/query-builder-helper';
import { genListResponse } from '../helpers/response/list-response';
import { UpdateDiff } from '../interfaces/update-diff';
import { genErrorResponse } from '../middlewares/response-error.middleware';
import { ensureSessionActive } from '../middlewares/session.middleware';
import { readNotifications } from '../services/notification/read-notifications';
import { updateNotification, updateSeenNotifications } from '../services/notification/save-notification';
import { LastSeenNotificationUpdateRequest, NotificationReadRequest, NotificationUpdateRequest } from '../shared';

const router = express.Router();

router.get('/', ensureSessionActive, (req: Request, res: Response) => {
  const readRequest: NotificationReadRequest = req.query;
  readNotifications(readRequest, req.session.account)
    .then((queryResult: QueryResult<NotificationEntity>) =>
      res.send(genListResponse(queryResult, readRequest))
    )
    .catch(genErrorResponse.bind(this, res));
});

router.put('/last-seen-notification', ensureSessionActive, (req: Request, res: Response) => {
  const updateReq: LastSeenNotificationUpdateRequest = req.body;
  updateSeenNotifications(req.session.account, updateReq.lastSeenNotificationId)
    .then((lastSeenNotificationId: number) => {
      req.session.account.lastSeenNotificationId = lastSeenNotificationId;
      res.send();
    })
    .catch(genErrorResponse.bind(this, res));
});

router.put('/', ensureSessionActive, (req: Request, res: Response) => {
  const updateReq: NotificationUpdateRequest = req.body;
  updateNotification(req.session.account, updateReq.notification)
    .then((notificationDiff: UpdateDiff<NotificationEntity>) => res.send(notificationDiff.new))
    .catch(genErrorResponse.bind(this, res));
});

module.exports = router;
