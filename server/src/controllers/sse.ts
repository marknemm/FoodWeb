import express = require('express');
import { Request, Response } from 'express';
import { sseManager } from '../helpers/messaging/sse-manager';
import { ensureSessionActive } from '../middlewares/session.middleware';
import { readUnseenNotificationsCount } from '../services/notification/read-notifications';
import { Account, ServerSentEventType } from '../shared';

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
