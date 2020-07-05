/**
 * An update diff containing the old object before the update, and the new object after the update.
 */
export interface UpdateDiff<T> {
  old: T;
  new: T;
}

/**
 * Represents various types of updates that may occur within an updated object's primitave properties.
 */
export enum UpdateType {
  Create = 'Create',
  Delete = 'Delete',
  Update = 'Update',
  None = 'None'
}

/**
 * Determines the type of the update that occured between a given old value and new value.
 * NOTE: oldVal and newVal should be primatives, or else this will be inaccurate.
 * @param oldVal The old value.
 * @param newVal The new value.
 * @return The type of the update that occured.
 */
export function determineUpdateType<T>(oldVal: T, newVal: T): UpdateType {
  if (oldVal == null && newVal != null) {
    return UpdateType.Create;
  }
  if (oldVal != null && newVal == null) {
    return UpdateType.Delete;
  }
  if (oldVal !== newVal) {
    return UpdateType.Update;
  }
  return UpdateType.None;
}
