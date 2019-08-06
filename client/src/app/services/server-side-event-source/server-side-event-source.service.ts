import { Injectable, ApplicationRef } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ServerSideEventType } from '../../../../../shared/src/interfaces/server-side-event/server-side-event';

@Injectable({
  providedIn: 'root'
})
export class ServerSideEventSourceService {

  private _eventSource: EventSource;
  private _onMessage = new ReplaySubject<MessageEvent>();
  private _onError = new ReplaySubject<MessageEvent>();

  constructor(
    private _applicationRef: ApplicationRef
  ) {}

  /**
   * Whether or not a server side event source connection is open.
   */
  get isOpen(): boolean {
    return (this._eventSource != null);
  }

  /**
   * Observable that emits an event message whenever the server side event client receives a message from the server.
   */
  get onMessage(): Observable<MessageEvent> {
    return this._onMessage.asObservable().pipe(
      map((event: MessageEvent) => {
        setTimeout(() => this._applicationRef.tick()); // Angular does not monkeypatch SSE, so must run change detection manually!
        return event;
      })
    );
  }

  /**
   * Observable that emits an event message whenever the server side event client receives an error from the server.
   */
  get onError(): Observable<MessageEvent> {
    return this._onError.asObservable();
  }

  /**
   * Opens a server side event connection (idempotent operation - does nothing if connection already open).
   */
  open(): void {
    if (!this.isOpen) {
      this._eventSource = new EventSource('/server/sse', { withCredentials: true });
      this._eventSource.onmessage = (event: MessageEvent) => {
        this._onMessage.next(event);
      }
      this._eventSource.onerror = (event: MessageEvent) => {
        console.error(event);
        this._onError.next(event);
      };
    }
  }

  /**
   * Gets an observable that emits received server side events that match a entry in a given list of notification types.
   * @param notificationTypes The notification types to filter.
   * @return An observable that emits filtered server side event data.
   */
  onMessageType<T>(eventTypes: ServerSideEventType | ServerSideEventType[]): Observable<T> {
    eventTypes = (eventTypes instanceof Array) ? eventTypes : [eventTypes];
    return this.onMessage.pipe(
      filter((message: MessageEvent) => (<string[]>eventTypes).indexOf(message.lastEventId) >= 0),
      map((message: MessageEvent) => JSON.parse(message.data))
    );
  }

  /**
   * Closes a server side event connection (idempotent operation - does nothing if there is no open connection).
   */
  close(): void {
    if (this.isOpen) {
      this._eventSource.close();
    }
  }
}