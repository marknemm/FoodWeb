export class ValidationHelper {

  validateRequiredFields<T>(obj: any, props: string[], names: string[]): string {
    for (let i = 0; i < props.length; i++) {
      // Fields are empty if they are null/undefined, an empty string, or a string with only whitespace.
      if (obj[props[i]] == null || (typeof obj[props[i]] === 'string' && obj[props[i]].trim() === '')) {
        return `${names[i]} required`;
      }
    }
    return '';
  }

  validateRegexFields(obj: any, props: string[], names: string[], regexs: RegExp[]): string {
    for (let i = 0; i < props.length; i++) {
      if (!regexs[i].test(obj[props[i]])) {
        return `Invalid ${names[i]}`;
      }
    }
    return '';
  }
}
