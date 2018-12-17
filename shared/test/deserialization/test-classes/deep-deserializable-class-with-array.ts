import { deserializable, deepDeserializable } from '../../../src/deserialization/deserializer';
import { BasicDeserializableClass } from './basic-deserializable-class';

/**
 * Deserializable class for testing deserialization class with deep deserialization properties and class inheritance.
 * Contains property, method, and accessor that all should be present and work propertly after deserialization.
 */
@deserializable('DeepDeserializableClassWithArray')
export class DeepDeserializableClassWithArray extends BasicDeserializableClass {

    @deepDeserializable(Date)
    private _dateArr: Date[];

    @deepDeserializable(BasicDeserializableClass)
    private _basicDeserializableArr: BasicDeserializableClass[];

    public constructor() {

        super();

        this._dateArr = [ new Date(), new Date('11/2/2018') ];
        this._basicDeserializableArr = [ new BasicDeserializableClass(), new BasicDeserializableClass() ];
    }

    get dateArr(): Date[] {
        return this._dateArr;
    }

    set dateArr(dateArr: Date[]) {
        this._dateArr = dateArr;
    }

    get basicDeserializableArr(): BasicDeserializableClass[] {
        return this._basicDeserializableArr;
    }

    set basicDeserializableArr(basicDeserializableArr: BasicDeserializableClass[]) {
        this._basicDeserializableArr = basicDeserializableArr;
    }
}
