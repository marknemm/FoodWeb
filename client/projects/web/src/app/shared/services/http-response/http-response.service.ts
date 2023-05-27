import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservableInput, OperatorFunction } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AlertService } from '~web/alert/services/alert/alert.service';
import { HttpResponseHandlerOptions } from '~web/shared/interfaces/http-response-handler-options';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';
export * from '~web/shared/interfaces/http-response-handler-options';

/**
 * An HTTP response service which contains loading monitors and default handlers for HTTP interactions.
 */
@Injectable({
  providedIn: 'root'
})
export class HttpResponseService {

  private _loadingRecords = new Set<any>();
  private _pageProgressLoadCnt = 0;

  constructor(
    private _alertService: AlertService,
    private _pageProgressService: PageProgressService
  ) {}

  /**
   * Whether or not any HTTP request is in progress.
   * @param service The service to check for loading requests. If not set then checks for any loading request for any service.
   */
  anyLoading(service?: any): boolean {
    let loading = (!service && this._loadingRecords.size > 0) || this.isLoading(service);
    for (const key in service ?? {}) {
      if (loading) { break; }
      loading = this.isLoading(service[key]);
    }
    return loading;
  }

  /**
   * Checks if an HTTP request, which is associated with a given ID (function ref), is in progress.
   * @param loadingId The ID associated with the HTTP request that is loading.
   * Can be any unique value, but usually will be reference to the function that triggered the HTTP request that is loading.
   */
  isLoading(loadingId: any): boolean {
    return !!this._loadingRecords.has(loadingId);
  }

  /**
   * An observable pipe that handles an HTTP response based on given options.
   * Some examples of the handling include:
   * - Triggering a blocking page progress indicator until a response is received.
   * - Processing and displaying HTTP error responses via a non-blocking warning alert.
   * - Forwarding the response value to a configured immutable store (See ImmutableStore for more details).
   * - Displaying a configured non-blocking success alert message upon reception of a success response.
   * @param loadingId The ID associated with the HTTP request that is loading.
   * Can be any unique value, but usually will be reference to the function that triggered the HTTP request that is loading.
   * @param opts An optional set of HTTP response handler options. See HttpResponseHandlerOptions for default values.
   * @return A pipeable rxjs operator function.
   */
  handleHttpResponse<T>(loadingId: any, opts: HttpResponseHandlerOptions<T> = {}): OperatorFunction<any, T> {
    return (httpResponse$: Observable<T>): Observable<T> => {
      opts = this._fillDefaultHttpHandlerOpts(opts);
      this._setLoadingStatus(loadingId, opts, true);
      return httpResponse$.pipe(
        tap((response: T) =>
          this._handleHttpSuccessResponse(response, opts)
        ),
        catchError((err: HttpErrorResponse) =>
          this._handleHttpErrorResponse(err, opts)
        ),
        finalize(() =>
          this._setLoadingStatus(loadingId, opts, false)
        )
      );
    };
  }

  /**
   * Fills given HTTP response handler options with default values wherever an option is missing.
   * @param opts A set of HTTP response handler options, which will be filled with default values.
   * @param defaultLoadingId The default ID associated with the HTTP request that is loading.
   * Can be any unique value, but usually will be reference to the function that triggered the HTTP request that is loading.
   * @return A copy of the input HTTP response handler options with default values filled.
   */
  private _fillDefaultHttpHandlerOpts<T>(
    opts: HttpResponseHandlerOptions<T>,
  ): HttpResponseHandlerOptions<T> {
    opts = (opts != null) ? Object.assign({}, opts) : {};
    opts.handleErrorResponse ??= true;
    opts.loaderBlocking ??= true;
    opts.showLoader ??= true;
    return opts;
  }

  /**
   * Sets the loading status for a given loadingId contained within HTTP response handler options.
   * @param loadingId The ID associated with the HTTP request that is loading.
   * Can be any unique value, but usually will be reference to the function that triggered the HTTP request that is loading.
   * @param opts The HTTP response handler options which contain the `loadingId`.
   * @param loading The loading status that is to be set.
   */
  private _setLoadingStatus<T>(loadingId: any, opts: HttpResponseHandlerOptions<T>, loading: boolean): void {
    // Keep track of each separate loading HTTP response.
    (loading)
      ? this._loadingRecords.add(loadingId)
      : this._loadingRecords.delete(loadingId);

    // If configured to show blocking page progress on load, then activate it as long as any response is loading.
    if (opts.showLoader) {
      if (loading && ++this._pageProgressLoadCnt === 1) {
        this._pageProgressService.activate(opts.loaderBlocking);
      } else if (this._pageProgressLoadCnt > 0 && --this._pageProgressLoadCnt === 0) {
        this._pageProgressService.deactivate();
      }
    }
  }

  /**
   * Performs default handling of successful HTTP responses based off of a set of given HTTP response handler options.
   * @param response The HTTP response value.
   * @param opts The HTTP response handler options which contain flags for handling successful responses.
   */
  private _handleHttpSuccessResponse<T>(response: T, opts: HttpResponseHandlerOptions<T>): void {
    // If an immutable store is configured, then set its state to the response data.
    if (opts.immutableStore) {
      opts.immutableStore.setValue(response);
    }

    // Display a success alert message if one is configured.
    if (opts.successMessage) {
      this._alertService.displayMessage(opts.successMessage, 'success');
    }
  }

  /**
   * Performs default handling of error HTTP responses based off of a set of given HTTP response handler options.
   * @param err The HTTP error response.
   * @param opts The HTTP response handler options which contain flags for handling error responses.
   */
  private _handleHttpErrorResponse<T>(err: HttpErrorResponse, opts: HttpResponseHandlerOptions<T>): ObservableInput<T> {
    // Re-throw the error if instructed not to perform default error response handling.
    if (!opts.handleErrorResponse) {
      throw err;
    }

    // Otherwise, perform default error handling, which will complete observable without emitting a value.
    return this._alertService.displayError(err, 'danger');
  }
}
