import SSE = require('sse');
import { SSEManager, SSEClient, SSEEvent, SSEOptions } from 'server-side-events';
import { Server } from 'http';
import { sessionReqHandler } from './session';
import { Account } from '../../../shared/src/interfaces/account/account';

/**
 * Manager for server side events.
 */
class FoodWebSSEManager {

  /**
   * Mappings of account IDs to SSEClient connections.
   */
  private readonly _clients = new Map<number, SSEClient>();
  private readonly _connectCb: ((account: Account) => any)[] = [];

  /**
   * Initializes the SSE (Server Side Event) Manager that listens for & establishes new client connections.
   * @param app The main express application.
   */
  init(server: Server): void {
    const opts: SSEOptions = { path: '/server/sse' };
    const sse: SSEManager = new SSE(server, opts);
    sse.on('connection', this._establishConnection.bind(this));
  }

  /**
   * Callback that is invoked by the SSEManager whenever a new client connection is established.
   * Adds the new client connection to contained Account -> SSEClient mappings.
   * @param client The new client connection.
   */
  private async _establishConnection(client: SSEClient): Promise<void> {
    sessionReqHandler(client.req, client.res, (err: Error) => {
      const session: Express.Session = client.req.session;
      if (!err && session && session.account) {
        const account: Account = session.account;
        // Close any old hanging connections associated with an account (prevent memory leaks).
        if (this._clients.has(account.id)) {
          this._clients.get(account.id).close();
        }
        this._clients.set(account.id, client);
        this._connectCb.forEach((cb) => cb(account));
      } else {
        // If user not logged in, then immediately close & discard the connection.
        client.close();
      }
    });
  }

  /**
   * Specifies a callback function that will be invoked whenever there is a new connection.
   * @param cb The callback function.
   */
  onConnect(cb: (account: Account) => any): void {
    this._connectCb.push(cb);
  }

  /**
   * Broadcasts a given Server Side Event to multiple _clients associated with the entries in a given user Accounts array.
   * If any user does not have an SSEClient connection setup, then nothing happens for that user.
   * @param accounts The user Accounts.
   * @param event The Server Side Event to broadcast.
   */
  broadcastEvent(accounts: Account[], event: SSEEvent): void {
    accounts.forEach((account: Account) => this.sendEvent(account, event));
  }

  /**
   * Sends a given Server Side Event to a client associated with a given user Account.
   * If the user does not have an SSEClient connection setup, then nothing happens.
   * @param account The user Account.
   * @param event The Server Side Event to send.
   */
  sendEvent(account: Account, event: SSEEvent): void {
    if (!this._clients.has(account.id)) { return; }
    const client: SSEClient = this._clients.get(account.id);
    event.data = (typeof event.data === 'object' ? JSON.stringify(event.data) : event.data);
    client.send(event);
  }
}

export const foodWebSSEManager = new FoodWebSSEManager();
