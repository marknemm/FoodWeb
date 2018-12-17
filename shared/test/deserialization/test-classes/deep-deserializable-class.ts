import { deserializable, deepDeserializable } from '../../../src/deserialization/deserializer';
import { BasicDeserializableClass } from './basic-deserializable-class';

/**
 * Deserializable class for testing most basic form of (shallow) deserialization.
 * Contains property, method, and accessor that all should be present and work propertly after deserialization.
 */
@deserializable('DeepDeserializableClass')
export class DeepDeserializableClass {

    @deepDeserializable(Date)
    private _date: Date;

    @deepDeserializable(BasicDeserializableClass)
    private _basicDeserializableClass: BasicDeserializableClass;

    public constructor() {
        this._date = new Date();
        this._basicDeserializableClass = new BasicDeserializableClass();
    }

    get date(): Date {
        return this._date;
    }

    set date(date: Date) {
        this._date = date;
    }

    get basicDeserializableClass(): BasicDeserializableClass {
        return this._basicDeserializableClass;
    }

    set basicDeserializableClass(basicDeserializableClass: BasicDeserializableClass) {
        this._basicDeserializableClass = basicDeserializableClass;
    }
}
