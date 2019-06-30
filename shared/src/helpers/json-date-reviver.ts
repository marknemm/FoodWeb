import { Validation } from '../constants/validation';

type JSONReviver = (key: string, value: any) => any;
type JSONParse = (text: string, reviver?: JSONReviver) => any;

/**
 * A helper that revives JSON date objects in received JSON responses.
 */
export class JSONDateReviver {

  /**
   * Initializes the global JSON date reviver that will automatically transform all received JSON ISO date strings into Date objects.
   */
  initJSONDateReviver(): void {
    const origJSONParse: JSONParse = JSON.parse;
    JSON.parse = (text: string, reviver?: JSONReviver) => {
      return origJSONParse(text, this._dateReviver.bind(this, reviver));
    };
  }

  /**
   * Revives JSON date ISO strings by transforming them (back) into Date objects.
   * @param origReviver The original JSON reviver provided to JSON.parse().
   * @param key The key of the JSON field that is being parsed.
   * @param value The value of the JSON field that is being parsed.
   */
  private _dateReviver(origReviver: JSONReviver, key: string, value: any): any {
    if (typeof value === 'string' && Validation.ISO_REGEX.test(value)) {
      return new Date(value);
    }
    if (origReviver) {
      return origReviver(key, value);
    }
    return value;
  }
}
