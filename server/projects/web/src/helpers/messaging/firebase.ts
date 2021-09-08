import * as admin from 'firebase-admin';
import { env } from '../globals/env';

export const firebase: admin.app.App = admin.initializeApp({
  credential: admin.credential.cert(env.FIREBASE_SERVICE_ACCOUNT)
});

export type Messaging = admin.messaging.Messaging;
export type Message = admin.messaging.Message;
export type MulticastMessage = admin.messaging.MulticastMessage;
