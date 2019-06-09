declare module 'server-side-events' {
  import { Application, Request, Response } from 'express';

  /**
   * Options for setting up an SSEClient.
   */
  export interface SSEOptions {
    /**
     * The path that the SSEClient should listen for connections on.
     * Default is '/sse'.
     */
    path?: string;
    /**
     * A callback function that is invoked before passing along any connection requests 
     */
    verifyRequest?: (req: Request) => boolean;
  }

  /**
   * An SSE-Event that will be sent to the client.
   */
  export interface SSEEvent {
    /**
     * The id of the event.
     */
    event?: string | number;
    /**
     * The message data for the event.
     */
    data?: any;
    /**
     * The id of the client-side object that the event should act upon.
     */
    id?: string | number;
    /**
     * A boolean that tells the client whether or not it should retry the event.
     */
    retry?: boolean;
  }

  /**
   * SSE Client that is responsible for sending events to the client.
   */
  export class SSEClient {
    /**
     * The request associated with the initial SSEClient connection.
     */
    req: Request;
    /**
     * The response associated with the initial SSEClient connection.
     */
    res: Response;

    /**
     * Sends data to the client as a Server Side Event.
     * @param event The event in the form of a SSEObject.
     */
    send(event: SSEEvent): void;
    /**
     * Closes the SSE stream and frees up all associated resources on the server-side.
     */
    close(): void;
  }

  /**
   * Manager for setting up an SSEClient for sending events.
   */
  export class SSEManager {
    constructor(app: Application, options?: SSEOptions);
    on(event: 'connection', cb: (client: SSEClient) => void): void;
  }
}
