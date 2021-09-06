import express = require('express');
import { Request, Response } from 'express';
import { Account, ServerSentEventType } from '~shared';
import { getSSEClient, SSEClient } from '~web/helpers/messaging/sse';
import { ensureSessionActive } from '~web/middleware/session.middleware';
import { readUnseenNotificationsCount } from '~web/services/notification/read-notifications';

const sseClient: SSEClient = getSSEClient();
sseClient.onConnect(async (account: Account) => {
  const unseenNotificationsCount: number = await readUnseenNotificationsCount(account);
  sseClient.sendEvent(account, {
    id: ServerSentEventType.NotificationsAvailable,
    data: { unseenNotificationsCount }
  });
});

export const router = express.Router();

router.get('/', ensureSessionActive, handleGetSSE);
export function handleGetSSE(req: Request, res: Response) {
  sseClient.addConnection(req, res);
}
