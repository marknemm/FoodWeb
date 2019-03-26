import { FoodWebError } from './food-web-error';

export class ValidationHelper {

  validateRequiredFields<T>(obj: any, props: string[], names: string[]): void {
    for (let i = 0; i < props.length; i++) {
      // Fields are empty if they are null/undefined, an empty string, or a string with only whitespace.
      if (obj[props[i]] == null || (typeof obj[props[i]] === 'string' && obj[props[i]].trim() === '')) {
        throw new FoodWebError(`${names[i]} required`);
      }
    }
  }

  validateRegexFields(obj: any, props: string[], names: string[], regexs: RegExp[]): void {
    for (let i = 0; i < props.length; i++) {
      if (!regexs[i].test(obj[props[i]])) {
        throw new FoodWebError(`Invalid ${names[i]}`);
      }
    }
  }
}
