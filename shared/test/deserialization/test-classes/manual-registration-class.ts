import { BasicDeserializableClass } from './basic-deserializable-class';

/**
 * Deserializable class for testing manual runtime programmatic calls to the deserializable annotation functions for deserialization registration.
 * Contains property, method, and accessor that all should be present and work propertly after deserialization.
 */
export class ManualRegistrationClass extends BasicDeserializableClass {

    private _date: Date;
    private _requiredProperty: any;
    private _skippedProperty: any;

    public constructor() {

        super();

        this._date = new Date();
    }

    get date(): Date {
        return this._date;
    }

    set date(date: Date) {
        this._date = date;
    }

    public skippedMethod(): void {}
}
