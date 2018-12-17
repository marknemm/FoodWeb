import { expect } from '../../test/test-shared';
import { Deserializer } from '../../src/deserialization/deserializer';
import { BasicDeserializableClass } from './test-classes/basic-deserializable-class';
import { DeepDeserializableClass } from './test-classes/deep-deserializable-class';
import { DeepDeserializableClassWithInheritance } from './test-classes/deep-deserializable-class-with-inheritance';
import { DeepDeserializableClassWithArray } from './test-classes/deep-deserializable-class-with-array';
import { UnregisteredClass } from './test-classes/unregistered-class';

const DESERIALIZER: Deserializer = new Deserializer();

describe('Deserializer Test', () => {

    it('Attempt deserialize unregistered object with explict type should work',
       testUnregisteredDeserialization.bind(this, UnregisteredClass, true, isShallowDeserializedCorrectly));
    it('Attempt deserialize unregistered object with implicit type should work (skips deserialization - no exceptions thrown)',
       testUnregisteredDeserialization.bind(this, UnregisteredClass, false, undefined)); // Should not be deserialized, so no validation needed.
    it('Basic deserialization with explicit type should work', testDeserialization.bind(this, BasicDeserializableClass, true, isShallowDeserializedCorrectly));
    it('Basic deserialization with implicit type should work', testDeserialization.bind(this, BasicDeserializableClass, false, isShallowDeserializedCorrectly));
    it('Deep deserialization should work', testDeserialization.bind(this, DeepDeserializableClass, false, isDeepDeserializedCorrectly));
    it('Deep deserialization with class inheritance should work', testDeserialization.bind(this, DeepDeserializableClassWithInheritance, false, isDeepDeserializedCorrectly));
    it('Deep deserialization targeting array member should work', testDeserialization.bind(this, DeepDeserializableClassWithArray, false, isDeepArrayDeserializedCorrectly));
});

function testUnregisteredDeserialization(
    TargetClassConstructor: Function,
    explicitType: boolean,
    validationFn: (_1: any, _2: Function) => void,
    done: MochaDone): void {

    // The result of constructing, serializing, and deserializing an object.
    const deserializeResult: any = constructAndDeserializeClass(TargetClassConstructor, explicitType);
    if (explicitType) {  validationFn(deserializeResult, TargetClassConstructor); }

    done();
}

/**
 * Tests the deserialization of a given class.
 * @param TargetClassConstructor The class constructor function.
 * @param explicitType Set to true if an explicit type (constructor function) should be passed to the deserializer when deserializing the target class.
 *                     Set to false if the type should be implicitly derived via the deserializableId on the class constructor function's prototype.
 * @param validationFn Set to a specific validation function for the correctness of the deserialization result.
 *                     NOTE: See definition of isBasicDeserializedCorrectly() for call signature details.
 * @param done Callback to be invoked when the test is done.
 */
function testDeserialization(
    TargetClassConstructor: Function,
    explicitType: boolean,
    validationFn: (_1: any, _2: Function) => void,
    done: MochaDone): void {

    // The result of constructing, serializing, and deserializing an object.
    const deserializeResult: any = constructAndDeserializeClass(TargetClassConstructor, explicitType);
    validationFn(deserializeResult, TargetClassConstructor);

    done();
}

/**
 * Constructs a new instance of the object to deserialize, (JSON) serializes the object, (JSON) parses the object, and invokes the custom desrializer on the object.
 * @param DeserializableConstructor The constructor function of the taget object.
 * @param explicitType Set to true if an explicit type (constructor function) should be passed to the deserializer, and false if no type should be passed.
 * @return The resulting deserialized object.
 */
function constructAndDeserializeClass(DeserializableConstructor: Function, explicitType: boolean): any {

    // Construct original class.
    const originalDeserializableClass = new DeserializableConstructor.prototype.constructor();

    // Convert to JSON string.
    const jsonDeserializableClass: string = JSON.stringify(originalDeserializableClass);

    // Parse JSON into object that needs further custom deserialization.
    const parsedBasicDeserializableClass: any = JSON.parse(jsonDeserializableClass);

    // Deserialize the parsed JSON object.
    return DESERIALIZER.deserialize(parsedBasicDeserializableClass, explicitType ? DeserializableConstructor
                                                                                 : null); // null for use implicit type via registration ID.);
}

/**
 * Checks if a deserialized object has been deserialized correctly.
 * To do this, it ensures that the prototype matches its constructor function's prototype
 * and that its own iterable properties match the properties that are normally in a newly created instance.
 * @param deserializedInstance The deserialized object to check.
 * @param DeserializedConstructor The constructor function for the deserialized object.
 */
function isShallowDeserializedCorrectly(deserializedInstance: any, DeserializedConstructor: Function): void {

    // Test deserialization result (ensure prototype of deserialized instance matches that of the BasicDeserializableClass constructor function).
    expect(deserializedInstance).to.be.an.instanceOf(DeserializedConstructor);

    // Ensure that deserialization result also has all of the instance properties (properties outside of prototype chain in own instance) in-tact.
    const originalInstance: any = new DeserializedConstructor.prototype.constructor();
    for (const property in originalInstance) {
        if (originalInstance.hasOwnProperty(property)) {
            deserializedInstance.should.have.property(property);
        }
    }
}

function isDeepDeserializedCorrectly(deserializedInstance: DeepDeserializableClass, DeserializedConstructor: Function): void {

    isShallowDeserializedCorrectly(deserializedInstance, DeserializedConstructor);

    // Ensure that the deep deserializable members have been recursively deserialized.
    isShallowDeserializedCorrectly(deserializedInstance.date, Date);
    isShallowDeserializedCorrectly(deserializedInstance.basicDeserializableClass, BasicDeserializableClass);
}

function isDeepArrayDeserializedCorrectly(deserializedInstance: DeepDeserializableClassWithArray, DeserializedConstructor: Function): void {

    isShallowDeserializedCorrectly(deserializedInstance, DeserializedConstructor);

    // Ensure that the deep deserializable array members have been recursively deserialized.
    for (let i = 0; i < deserializedInstance.dateArr.length; i++) {
        isShallowDeserializedCorrectly(deserializedInstance.dateArr[i], Date);
    }
    for (let i = 0; i < deserializedInstance.basicDeserializableArr.length; i++) {
        isShallowDeserializedCorrectly(deserializedInstance.basicDeserializableArr[i], BasicDeserializableClass);
    }
}

// TODO: Write test functions for required and skip deserialization functionality correctness.
