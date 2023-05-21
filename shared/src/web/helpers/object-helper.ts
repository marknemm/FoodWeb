import * as _ from 'lodash';

/**
 * Contains various helper methods for JS objects.
 */
export class ObjectHelper {

  /**
   * Merges a given list of object fields from a given src object to a dest object.
   * @param src The source object that shall have its fields merged into dest.
   * @param dest The dest object that will be internally modified by the merge (`modified internally`).
   * @param fields The names of the object fields that should be merged. Supports dot-notation for nested fields.
   * @return The dest object with fields merged in.
   */
  mergeFields<O extends Object>(src: Partial<O>, dest: Partial<O>, fields: string[]): Partial<O> {
    if (fields) {
      for (const field of fields) {
        _.set(dest, field, _.get(src, field));
      }
    }
    return dest;
  }

  /**
   * A recursive, in-place, version of lodash `omitBy`.
   * @param value The value to omit the fields of (`modified internally`).
   * @param predicate The predicate matched recursively against each field. When `true`, the field is omitted.
   * @returns The `value` with its fields recursively omitted.
   */
  omitByRecursive<O extends Object>(value: Partial<O>, predicate: (value: any) => boolean): Partial<O> {
    if (!_.isObjectLike(value) && !_.isArray(value)) {
      return value;
    }

    for (const field in value) {
      if (_.isArray(value[field])) {
        for (const elem of value[field] as any) {
          this.omitByRecursive(elem, predicate);
        }
      } else {
        this.omitByRecursive(value[field], predicate);
      }

      if (predicate(value[field])) {
        delete value[field];
      }
    }

    return value;
  }

}
