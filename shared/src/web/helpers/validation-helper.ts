/**
 * Contains functionality for basic validation support.
 */
export class ValidationHelper {

  /**
   * Performs a given list of validation queries on the top level properties of a given object.
   * @param obj The object that will have validation done on its top level properties.
   * @param validationQueries The list of validation queries which specify required and/or regex validation that should be
   * performed on specified top level properties of the obj argument. If a property name is only provided in place of a validation
   * query, then it is assumed that the property is required.
   * @return A string specifying the required or regex validation error message. If no error is present, then an empty string.
   */
  validateProps<T, K extends Extract<keyof T, string>>(obj: T, validationQueries: (ValidationQuery<T> | K)[]): string {
    if (obj) {
      for (let i = 0; i < validationQueries.length; i++) {
        const validationQuery: ValidationQuery<T> = this._toValidationQuery(validationQueries[i]);
        const value: any = obj[validationQuery.prop];
        // If regex & required are not specified, then default to using required validation only.
        validationQuery.required = validationQuery.required || (!validationQuery.regex && validationQuery.required === undefined);

        const requireErrMsg: string = this._testRequiredValidation(validationQuery, value);
        const regexErrMsg: string = this._testRegexValidation(validationQuery, `${value}`);
        if (requireErrMsg || regexErrMsg) {
          return (requireErrMsg || regexErrMsg);
        }
      }
    }
    return '';
  }

  /**
   * Converts a given raw validation query into a validation query.
   * @param rawValidationQuery The raw validation query consisting either of the property to perform required validation on or
   * an actual validation query.
   * @return A validation query.
   */
  private _toValidationQuery<T, K extends Extract<keyof T, string>>(rawValidationQuery: K | ValidationQuery<T>): ValidationQuery<T> {
    return (typeof rawValidationQuery === 'string')
      ? { prop: rawValidationQuery }
      : rawValidationQuery;
  }

  /**
   * Tests required validation on a given value according to a given validation query.
   * @param validationQuery The validation query.
   * @param value The value that is to be tested.
   * @return The required validation error message if value is empty. Otherwise an empty string.
   */
  private _testRequiredValidation<T>(validationQuery: ValidationQuery<T>, value: any): string {
    // Fields are empty if they are null/undefined, an empty string, or a string with only whitespace.
    if (validationQuery.required && (value == null || (typeof value === 'string' && value.trim() === ''))) {
      return (validationQuery.requiredErrMsg || validationQuery.errMsg || `${this._getErrPropName(validationQuery)} field required`);
    }
  }

  /**
   * Tests regex validation on a given value according to a given validation query.
   * @param validationQuery The validation query.
   * @param value The value that is to be tested.
   * @return The regex validation error message if value does not match the validation query's regex pattern. Otherwise an empty string.
   */
  private _testRegexValidation<T>(validationQuery: ValidationQuery<T>, value: string): string {
    if (validationQuery.regex && !validationQuery.regex.test(value)) {
      return (validationQuery.regexErrMsg || validationQuery.errMsg || `Invalid ${this._getErrPropName(validationQuery)}`);
    }
  }

  /**
   * Gets an error property's most readable name.
   * @param validationQuery The validation query from which to extract the error property's name.
   * @return The error property's name.
   */
  private _getErrPropName<T>(validationQuery: ValidationQuery<T>): string {
    return (validationQuery.name)
      ? validationQuery.name
      : validationQuery.prop.replace(/([A-Z][a-z]|[0-9]+)/g, ' $1').replace(/([A-Z]{2,})/g, ' $1').replace('_', ' ');
  }
}

/**
 * A compact validation query for performing simple validation of the top level properties of an associated object.
 * @param T The type of the entity or object that is to have its top level properties validated.
 */
export interface ValidationQuery<T, K = Extract<keyof T, string>> {
  /**
   * The top-level entity or object property that is to be validated.
   */
  prop: K;
  /**
   * An optional readable name of the top-level property that shall be included in default error messages. Defaults to prop.
   */
  name?: string;
  /**
   * Whether or not to perform required validation.
   * If both required & regex are null/undefined, then defaults to true, otherwise false.
   */
  required?: boolean;
  /**
   * The pattern that shall be used for regex validation. If not supplied, then regex validation will not occur.
   */
  regex?: RegExp;
  /**
   * The optional error message that is presented upon both required or regex validation failure.
   */
  errMsg?: string;
  /**
   * The optional error message that is presented upon required validation failure. Takes precedence over errMsg.
   */
  requiredErrMsg?: string;
  /**
   * The optional error message that is presented upon regex validation failure. Takes precedence over errMsg.
   */
  regexErrMsg?: string;
}
