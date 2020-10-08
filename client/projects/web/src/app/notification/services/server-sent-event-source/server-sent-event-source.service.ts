import { ApplicationRef, Injectable } from '@angular/core';
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ServerSentEventType } from '~shared';
import { environment } from '~web-env/environment';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';

const EventSource = NativeEventSource || EventSourcePolyfill;

@Injectable({
  providedIn: 'root'
})
export class ServerSentEventSourceService {

  readonly url = `${environment.server}/sse`;

  private _eventSource: EventSource;
  private _onMessage = new ReplaySubject<MessageEvent>();
  private _onError = new ReplaySubject<Event>();

  constructor(
    private _applicationRef: ApplicationRef,
    private _authService: AuthenticationService
  ) {
    this._authService.login$.subscribe(() => this.open());
    this._authService.logout$.subscribe(() => this.close());
    if (this._authService.loggedIn) { this.open(); }
  }

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
  get onError(): Observable<Event> {
    return this._onError.asObservable();
  }

  /**
   * Opens a server side event connection (idempotent operation - does nothing if connection already open).
   */
  open(): void {
    if (!this.isOpen) {
      this._eventSource = new EventSource(this.url, { withCredentials: true });
      this._eventSource.onmessage = (event: MessageEvent) => this._onMessage.next(event);
      this._eventSource.onerror = (event: Event) => this._onError.next(event);
    }
  }

  /**
   * Gets an observable that emits received server side events that match a entry in a given list of server-sent event types.
   * @param eventTypes The event types to filter.
   * @return An observable that emits filtered server side event data.
   */
  onMessageType<T>(eventTypes: ServerSentEventType | ServerSentEventType[]): Observable<T> {
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
      this._eventSource = null;
    }
  }
}
