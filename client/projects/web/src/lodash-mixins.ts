import * as _ from 'lodash';

interface LoDashMixins extends _.LoDashStatic {
  /**
   * Converts a BooleanInput or string to a boolean.
   * @param input The BooleanInput or string to convert.
   * @return The boolean conversion result.
   */
  toBoolean: (input: BooleanInput | string) => boolean;
}

_.mixin({
  toBoolean: (input: BooleanInput | string): boolean => (!!input && input !== 'false')
});

export default <LoDashMixins>_;
