import { ReadRequest } from '~shared';
import { TFormGroup } from '~web/forms';

/**
 * A common interface for getting a list {@link ReadRequest} from a list filters form.
 * @param T The type of the `ReadRequest`.
 */
export abstract class PageListFiltersForm<T extends ReadRequest = ReadRequest> extends TFormGroup<T> {

  /**
   * @returns The read request derived from this form's value.
   */
  toReadRequest?(): ReadRequest;
}
