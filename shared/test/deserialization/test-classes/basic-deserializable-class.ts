import { deserializable } from '../../../src/deserialization/deserializer';

/**
 * Deserializable class for testing most basic form of (shallow) deserialization.
 * Contains property, method, and accessor that all should be present and work propertly after deserialization.
 */
@deserializable('BasicDeserializableClass')
export class BasicDeserializableClass {

    private _basicMethodRetStr: string;

    public constructor() {
        this._basicMethodRetStr = 'Basic method works!';
    }

    public basicMethod(): string {
        return this.basicMethodRetStr;
    }

    get basicMethodRetStr(): string {
        return this._basicMethodRetStr;
    }

    set basicMethodRetStr(str: string) {
        this._basicMethodRetStr = str;
    }
}
