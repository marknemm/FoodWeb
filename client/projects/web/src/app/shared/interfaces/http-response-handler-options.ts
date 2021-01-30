import { ImmutableStore } from '~web/shared/classes/immutable-store';

/**
 * Options configuration for the HTTP response handler within the HttpResponseService.
 */
export interface HttpResponseHandlerOptions<T> {
  /**
   * Whether or not to perform default handling of HTTP error responses. Defaults to true.
   */
  handleErrorResponse?: boolean;
  /**
   * The immutable store that should have its state set upon receiving a successful response.
   */
  immutableStore?: ImmutableStore<T>;
  /**
   * An ID that can be specifically given to the current HTTP request to check if it is specifically loading.
   * Note that this can be any type (e.g. string, number, object).
   */
  loadingId?: any;
  /**
   * Whether or not the page progress indicator should be a blocking spinner. Defaults to true.
   */
  pageProgressBlocking?: boolean;
  /**
   * Whether or not to show a page progress indicator on load. Defaults to true.
   */
  showPageProgressOnLoad?: boolean;
  /**
   * A message that shall be shown in a success alert upon the reception of a successful response. Shows nothing if not set.
   */
  successMessage?: string;
}
