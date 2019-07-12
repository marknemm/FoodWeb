import SSE = require('sse');
import { SSEManager, SSEOptions, SSEClient, SSEEvent } from 'server-side-events';
import { Application, Request } from 'express';
import { Account } from '../../../shared/src/interfaces/account/account';

/**
 * Mappings of account IDs to SSEClient connections.
 */
const clients = new Map<number, SSEClient>();

/**
 * Initializes the SSE (Server Side Event) Manager that listens for & establishes new client connections.
 * @param app The main express application.
 */
export function initSSE(app: Application): void {
  const opts: SSEOptions = {
    path: '/server/sse',
    // Ensure that only clients that are logged in can create an SSE connection.
    verifyRequest: (req: Request) => (req.session && req.session.account)
  };
  const sse: SSEManager = new SSE(app, opts);
  sse.on('connection', _establishSSEConnection);
}

/**
 * Callback that is invoked by the SSEManager whenever a new client connection is established.
 * Adds the new client connection to contained Account -> SSEClient mappings.
 * @param client The new client connection.
 */
function _establishSSEConnection(client: SSEClient): void {
  const account: Account = client.req.session.account;
  // Close any old hanging connections associated with an account (prevent memory leaks).
  if (clients.has(account.id)) {
    clients.get(account.id).close();
  }
  clients.set(account.id, client);
}

/**
 * Broadcasts a given Server Side Event to multiple clients associated with the entries in a given user Accounts array.
 * If any user does not have an SSEClient connection setup, then nothing happens for that user.
 * @param accounts The user Accounts.
 * @param event The Server Side Event to broadcast.
 */
export function broadcastEvent(accounts: Account[], event: SSEEvent): void {
  accounts.forEach((account: Account) => sendEvent(account, event));
}

/**
 * Sends a given Server Side Event to a client associated with a given user Account.
 * If the user does not have an SSEClient connection setup, then nothing happens.
 * @param account The user Account.
 * @param event The Server Side Event to send.
 */
export function sendEvent(account: Account, event: SSEEvent): void {
  if (!clients.has(account.id)) { return; }
  const client: SSEClient = clients.get(account.id);
  event.data = (typeof event.data === 'object' ? JSON.stringify(event.data) : event.data);
  client.send(event);
}
