import express = require('express');
import { Request, Response } from 'express';
import { sseManager } from '~web/helpers/messaging/sse-manager';
import { ensureSessionActive } from '~web/middlewares/session.middleware';
import { readUnseenNotificationsCount } from '~web/services/notification/read-notifications';
import { Account, ServerSentEventType } from '~shared';

export const router = express.Router();

router.get('/', ensureSessionActive, handleGetSSE);
export function handleGetSSE(req: Request, res: Response) {
  sseManager.addConnection(req, res);
}

sseManager.onConnect(async (account: Account) => {
  const unseenNotificationsCount: number = await readUnseenNotificationsCount(account);
  sseManager.sendEvent(account, {
    id: ServerSentEventType.NotificationsAvailable,
    data: { unseenNotificationsCount }
  });
});
