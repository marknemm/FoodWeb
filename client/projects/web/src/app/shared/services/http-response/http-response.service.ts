import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservableInput, OperatorFunction } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AlertService } from '~web/shared/alert/alert.service';
import { ErrorHandlerService } from '~web/shared/error-handler/error-handler.service';
import { PageProgressService } from '~web/shared/page-progress/page-progress.service';
import { HttpResponseHandlerOptions } from './http-response-handler-options';
export { HttpResponseHandlerOptions };

@Injectable({
  providedIn: 'root'
})
export class HttpResponseService {

  private _loadingRecords = new Map<Observable<any>, boolean>();

  constructor(
    private _alertService: AlertService,
    private _errorHandlerService: ErrorHandlerService,
    private _pageProgressService: PageProgressService
  ) {}

  get loading(): boolean {
    return (this._loadingRecords.size > 0);
  }

  isLoading<T>(httpResponse$: Observable<T>): boolean {
    return !!this._loadingRecords.get(httpResponse$);
  }

  handleHttpResponse<T>(opts: HttpResponseHandlerOptions<T> = {}): OperatorFunction<Object, T> {
    return (httpResponse$: Observable<T>): Observable<T> => {
      opts = this.fillDefaultHttpHandlerOpts(opts);
      this.setLoadingStatus(httpResponse$, opts, true);
      return httpResponse$.pipe(
        tap((response: T) => this.handleHttpSuccessResponse(response, opts)),
        catchError((err: HttpErrorResponse) => this.handleHttpErrorResponse(err, opts)),
        finalize(() => this.setLoadingStatus(httpResponse$, opts, false))
      );
    }
  }

  private fillDefaultHttpHandlerOpts<T>(opts: HttpResponseHandlerOptions<T>): HttpResponseHandlerOptions<T> {
    opts = (opts != null) ? Object.assign({}, opts) : {};
    opts.handleErrorResponse = (opts.handleErrorResponse != null) ? opts.handleErrorResponse : true;
    opts.pageProgressBlocking = (opts.pageProgressBlocking != null) ? opts.pageProgressBlocking : true;
    opts.showPageProgressOnLoad = (opts.showPageProgressOnLoad != null) ? opts.showPageProgressOnLoad : true;
    return opts;
  }

  private setLoadingStatus<T>(httpResponse$: Observable<T>, opts: HttpResponseHandlerOptions<T>, loading: boolean): void {
    // Keep track of each separate loading HTTP response.
    (loading)
      ? this._loadingRecords.set(httpResponse$, true)
      : this._loadingRecords.delete(httpResponse$);

    // If configured to show blocking page progress on load, then activate it as long as any response is loading.
    if (opts.showPageProgressOnLoad) {
      (this._loadingRecords.size > 0)
        ? this._pageProgressService.activate(opts.pageProgressBlocking)
        : this._pageProgressService.reset();
    }
  }

  private handleHttpSuccessResponse<T>(response: T, opts: HttpResponseHandlerOptions<T>): void {
    // If an immutable store is configured, then set its state to the response data.
    if (opts.immutableStore) {
      opts.immutableStore.setState(response);
    }

    // Display a success alert message if one is configured.
    if (opts.successMessage) {
      this._alertService.displaySimpleMessage(opts.successMessage, 'success');
    }
  }

  private handleHttpErrorResponse<T>(err: HttpErrorResponse, opts: HttpResponseHandlerOptions<T>): ObservableInput<T> {
    // Re-throw the error if instructed not to perform default error response handling.
    if (!opts.handleErrorResponse) {
      throw err;
    }

    // Otherwise, perform default error handling, which will complete observable without emitting a value.
    return this._errorHandlerService.handleError(err);
  }
}
