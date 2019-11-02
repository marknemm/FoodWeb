import express = require('express');
import { Request, Response } from 'express';
import { ensureSessionActive } from '../middlewares/session.middleware';
import { sseManager } from '../helpers/sse-manager';
import { readUnseenNotificationsCount } from '../services/read-notifications';
import { ServerSentEventType } from '../../../shared/src/interfaces/server-sent-event/server-sent-event';
import { Account } from '../../../shared/src/interfaces/account/account';

const router = express.Router();

router.get('/', ensureSessionActive, (req: Request, res: Response) => {
  sseManager.addConnection(req, res);
});

sseManager.onConnect(async (account: Account) => {
  const unseenNotificationsCount: number = await readUnseenNotificationsCount(account);
  sseManager.sendEvent(account, {
    id: ServerSentEventType.NotificationsAvailable,
    data: { unseenNotificationsCount }
  });
});

module.exports = router;
