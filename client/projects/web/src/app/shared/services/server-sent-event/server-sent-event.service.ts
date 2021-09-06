import { Injectable, NgZone } from '@angular/core';
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ServerSentEventType } from '~shared';
import { environment } from '~web-env/environment';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';

const EventSource = NativeEventSource || EventSourcePolyfill;

/**
 * Initializes and maintains server sent event (SSE) functionality.
 */
@Injectable({
  providedIn: 'root'
})
export class ServerSentEventService {

  readonly url = `${environment.server}/sse`;

  private _eventSource: EventSource;

  private _close$ = new Subject<void>();
  private _message$ = new ReplaySubject<MessageEvent>(100);
  private _open$ = new Subject<void>();
  private _error$ = new ReplaySubject<Event>(100);

  constructor(
    private _authService: AuthenticationService,
    private _ngZone: NgZone,
  ) {
    this.error$.subscribe(console.error);
    this._authService.login$.subscribe(() => this.open());
    this._authService.logout$.subscribe(() => this.close());
    if (this._authService.loggedIn) { this.open(); }
  }

  /**
   * Whether or not a server side event source connection is open.
   */
  get opened(): boolean {
    return (this._eventSource != null);
  }

  /**
   * Observable that emits whenever a server side event connection is closed.
   */
  get close$(): Observable<void> {
    return this._close$.asObservable();
  }

  /**
   * Observable that emits an event message whenever the server side event client receives a message from the server.
   */
  get message$(): Observable<MessageEvent> {
    return this._message$.asObservable();
  }

  /**
   * Observable that emits whenever a server side event connection is opened.
   */
  get open$(): Observable<void> {
    return this._open$.asObservable();
  }

  /**
   * Observable that emits an event whenever the server side event client receives an error from the server.
   */
  get error$(): Observable<Event> {
    return this._error$.asObservable();
  }

  /**
   * Opens a server side event connection (idempotent operation - does nothing if connection already open).
   */
  open(): void {
    if (!this.opened) {
      this._eventSource = new EventSource(this.url, { withCredentials: true });
      this._eventSource.onopen = () =>
        this._ngZone.run(() => this._open$.next());
      this._eventSource.onmessage = (event: MessageEvent) =>
        this._ngZone.run(() => this._message$.next(event));
      this._eventSource.onerror = (event: Event) =>
        this._ngZone.run(() => this._error$.next(event));
    }
  }

  /**
   * Gets an observable that emits received server side events that match a entry in a given list of server-sent event types.
   * @param eventTypes The event types to filter.
   * @return An observable that emits filtered server side event data.
   */
  onMessageType<T>(eventTypes: ServerSentEventType | ServerSentEventType[]): Observable<T> {
    eventTypes = (eventTypes instanceof Array) ? eventTypes : [eventTypes];
    return this.message$.pipe(
      filter((message: MessageEvent) => (<string[]>eventTypes).indexOf(message.lastEventId) >= 0),
      map((message: MessageEvent) => JSON.parse(message.data))
    );
  }

  /**
   * Closes a server side event connection (idempotent operation - does nothing if there is no open connection).
   */
  close(): void {
    if (this.opened) {
      this._eventSource.close();
      this._eventSource = null;
      this._close$.next();
    }
  }
}
