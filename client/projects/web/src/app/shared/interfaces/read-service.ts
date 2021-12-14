import { Observable } from 'rxjs';
import { ListResponse, ReadRequest } from '~shared';

export interface ReadService<T = any> {

  /**
   * Whether or not a read request is loading or ongoing.
   */
  readonly loading: boolean;

  /**
   * Gets one item based off of a given unique database ID.
   * @param id The unique ID of the item to retrieve.
   * @return An observable that emits the item retrieved from the server.
   */
  getOne(id: number): Observable<T>;

  /**
   * Gets items based off of given filter and paging parameters.
   * @param request The {@link ReadRequest} used to filter & query the data.
   * @param showLoader Whether or not to show the page progress loader while loading. Defaults to `true`.
   * @return An observable that emits the {@link ListResponse} that was received from the server.
   */
  getMany(request: ReadRequest, showLoader?: boolean): Observable<ListResponse<T>>;
}
