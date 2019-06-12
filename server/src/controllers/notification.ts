import express = require('express');
import { Request, Response } from 'express';
import { handleError } from '../middlewares/response-error.middleware';
import { ensureSessionActive } from '../middlewares/session.middleware';
import { genListResponse } from '../helpers/list-response';
import { readNotifications, NotificationsQueryResult } from '../services/read-notifications';
import { Notification } from '../../../shared/src/interfaces/notification/notification';
import { NotificationReadRequest } from '../../../shared/src/interfaces/notification/notification-read-request';

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

module.exports = router;
