import * as admin from 'firebase-admin';
import * as serviceAccount from './firebase-service-account.json';

export const firebase: admin.app.App = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

export type Messaging = admin.messaging.Messaging;
export type Message = admin.messaging.Message;
export type MulticastMessage = admin.messaging.MulticastMessage;
