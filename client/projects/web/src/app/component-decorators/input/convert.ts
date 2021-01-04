import 'reflect-metadata';
import { BooleanConverter } from './boolean-converter';
import { DateConverter } from './date-converter';
import { NumberConverter } from './number-converter';
import { StringConverter } from './string-converter';

/**
 * Performs implicit type conversions in an attempt to convert compatible input binding values to their expected types.
 * @param converterFn A converter function that will be called whenever a value is set for the Input property.
 * If not specified, then a default converter function will be used for primitive types (Boolean, Date, Number, String).
 */
export function Convert(converterFn?: (value: any, key: string) => any): Function {
  return (ctor: Function, key: string) => {
    // If not explicitly given a converter, then attempt to derive a default one based on the property type.
    if (!converterFn) {
      const metadata: any = Reflect.getMetadata('design:type', ctor, key);
      if (!metadata) { throw new Error('The reflection metadata could not be found.'); }

      switch (metadata.name) {
        case 'Boolean': converterFn = BooleanConverter; break;
        case 'Date':    converterFn = DateConverter;    break;
        case 'Number':  converterFn = NumberConverter;  break;
        case 'String':  converterFn = StringConverter;  break;
      }
    }

    // Replace the property with a getter/setter that performs implicit conversions where necessary.
    if (converterFn) {
      const definition: PropertyDescriptor = Object.getOwnPropertyDescriptor(ctor, key);
      if (definition) { // Overlaod - Getter/setter already exists.
        Object.defineProperty(ctor, key, {
          get: definition.get,
          set: (value: any) => definition.set(converterFn(value, key)),
          enumerable: true,
          configurable: true
        });
      } else { // Generate - Getter/setter does not exist.
        Object.defineProperty(ctor, key, {
          // tslint:disable-next-line: object-literal-shorthand
          get: function() { return this[`__${key}`]; },
          // tslint:disable-next-line: object-literal-shorthand
          set: function(value: any) { this[`__${key}`] = converterFn(value, key); },
          enumerable: true,
          configurable: true
        });
      }
    }
  };
}
