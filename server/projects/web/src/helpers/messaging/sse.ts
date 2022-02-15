import { Request, Response } from 'express';
import { AccountEntity } from '~entity';
import { Account } from '~shared';

/**
 * A server-sent event (SSE) client that is used to send notifications from the server directly to the mobile & web app.
 */
export class SSEClient {

  /**
   * The singleton instance of this SSEClient.
   */
  private static _instance: SSEClient;

  /**
   * Mappings of Account IDs to SSE Connections.
   */
  private readonly _connections = new Map<number, SSEConnection>();
  private readonly _connectCbs: ((account: Account) => any)[] = [];

  /**
   * Private constructor to enforce singleton instance.
   */
  private constructor() {}

  /**
   * Generates/gets a singleton instance of the SSEClient.
   * @return The SSEClient.
   */
  static getInstance(): SSEClient {
    if (!SSEClient._instance) {
      SSEClient._instance = new SSEClient();
    }
    return SSEClient._instance;
  }

  /**
   * Adds a new server sent event connection to the manager.
   * @param req The request that was sent by the client to initialize the connection.
   * @param res The response that will be used to send data back to the client.
   * @return The ID of the new connection (same as the user's account ID).
   */
  addConnection(req: Request, res: Response): number {
    const connection: SSEConnection = this._setupConnection(req, res);
    const account: Account = req.session.account;
    this.removeConnection(account); // Close any old/hanging connections.
    this._connections.set(account.id, connection);
    this._connectCbs.forEach((cb) => cb(account));
    return account.id;
  }

  /**
   * Sets up a new server sent event connection.
   * @param req The request that was sent by the client to initialize the connection.
   * @param res The response that will be used to send data back to the client.
   * @return The new SSE connection.
   */
  private _setupConnection(req: Request, res: Response): SSEConnection {
    const account: AccountEntity = req.session.account;
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive'
    });
    res.on('close', () => this.removeConnection(account));
    res.write(':ok\n\n');
    return { req, res };
  }

  /**
   * Removes a Server Sent Event connection that is associated with a given account.
   * If the connection does not exist, then nothing happens.
   * @param account The account associated with the connection that is to be removed.
   */
  removeConnection(account: Account): void {
    if (this._connections.has(account.id)) {
      if (!this._connections.get(account.id).res.writableEnded) {
        this._connections.get(account.id).res.end();
      }
      this._connections.delete(account.id);
    }
  }

  /**
   * Specifies a callback function that will be invoked whenever there is a new connection.
   * @param cb The callback function.
   */
  onConnect(cb: (account: Account) => any): void {
    this._connectCbs.push(cb);
  }

  /**
   * Broadcasts a given Server Sent Event to multiple connected clients
   * If any user does not have a connection setup, then nothing happens for that user.
   * @param accounts The user Accounts.
   * @param event The Server Sent Event to broadcast.
   */
  broadcastEvent(accounts: Account[], sse: SSE): void {
    accounts.forEach((account: Account) => this.sendEvent(account, sse));
  }

  /**
   * Sends a given Server Sent Event to a client associated with a given user Account.
   * If the user does not have a connection setup, then nothing happens.
   * @param account The user Account.
   * @param event The Server Sent Event to send.
   */
  sendEvent(account: Account, sse: SSE): void {
    if (!this._connections.has(account.id)) { return; }
    const connection: SSEConnection = this._connections.get(account.id);
    const payload: string = this._genSSEPayload(sse);
    connection.res.write(payload, (error: Error) => {
      if (error) {
        console.error(error);
      }
    });
  }

  /**
   * Generates Server Sent Event formatted payload data that is to be sent to the client.
   * @param event The Server Sent Event from which to generate the payload data.
   * @return The payload data.
   */
  private _genSSEPayload(sse: SSE): string {
    let payload = '';
    sse.data = (typeof sse.data === 'object' ? JSON.stringify(sse.data) : sse.data);
    payload += (sse.event ? `event: ${sse.event}\n` : '');
    payload += (sse.retry ? `retry: ${sse.retry}\n` : '');
    payload += (sse.id ? `id: ${sse.id}\n` : '');
    payload += (sse.data ? `data: ${sse.data}\n` : '');
    payload += (payload ? '\n' : '');
    return payload;
  }
}

/**
 * A Server Sent Event connection.
 */
export interface SSEConnection {
  req: Request;
  res: Response;
}

/**
 * A Server Sent Event.
 */
export interface SSE {
  event?: string;
  data?: any;
  id?: string | number;
  retry?: string;
}

/**
 * Generates/gets a singleton instance of the SSEClient.
 * @return The SSEClient.
 */
export function getSSEClient(): SSEClient {
  return SSEClient.getInstance();
}
