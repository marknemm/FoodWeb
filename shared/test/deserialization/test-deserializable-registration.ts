import { expect } from '../../test/test-shared';
import { deserializable, requireDeserializable, deepDeserializable, skipDeserializable } from '../../src/deserialization/deserializer';
import { DeserializableRegistry } from '../../src/deserialization/deserializable-registration/deserializable-registry';
import { Deserializable } from '../../src/deserialization/deserializable-registration/deserializable';
import { ManualRegistrationClass } from './test-classes/manual-registration-class';

describe('Deserializable Registry Test', () => {
  it('deserializable class decorator should register deserializable class', testDeserializableRegistration.bind(this));
  it('requiredDeserializableMember class member decorator should record class member as required', testRecordRequiredMembers.bind(this));
  it('deepDeserializableMember property decorator should record property as deep deserializable', testRecordDeepDeserializableMembers.bind(this));
  it('skipDeserializableMember class member decorator should record class member as skipped', testRecordSkippedMembers.bind(this));
});

function testDeserializableRegistration(done: MochaDone): void {
  deserializable('ManualRegistrationClass')(ManualRegistrationClass);

  // Make sure the deserializable ID is added to the prototype of the deserializable class.
  const manualRegistrationClass: ManualRegistrationClass = new ManualRegistrationClass();
  manualRegistrationClass.should.have.property('deserializableId');
  manualRegistrationClass['deserializableId'].should.be.a('string');

  // Make sure we can access deserializable metadata for class using an instance of the class and the (class) constructor function's prototype.
  const getDeserializableArgArr: any[] = [new ManualRegistrationClass(), ManualRegistrationClass.prototype];
  for (let i = 0; i < getDeserializableArgArr.length; i++) {

    const manualRegistrationDeserializable: Deserializable = DeserializableRegistry.getDeserializable(getDeserializableArgArr[i]);
    manualRegistrationDeserializable.should.be.a('object');
    expect(manualRegistrationDeserializable.ClassConstructor).to.eql(ManualRegistrationClass);
  }

  done();
}

function testRecordRequiredMembers(done: MochaDone): void {
  requireDeserializable()(ManualRegistrationClass.prototype, '_requiredProperty');

  // Ensure that all required deserialization members have been recorded.
  const manualRegistrationDeserializable: Deserializable = DeserializableRegistry.getDeserializable(new ManualRegistrationClass());
  const requiredDeserializationMemberNames: string[] = manualRegistrationDeserializable.getRequiredDeserializableMemberNames();
  expect(requiredDeserializationMemberNames).to.include('_requiredProperty');

  done();
}

function testRecordDeepDeserializableMembers(done: MochaDone): void {
  deepDeserializable(Date)(ManualRegistrationClass.prototype, '_date');

  // Ensure that all deep deserializable memebers have been recorded.
  const manualRegistrationDeserializable: Deserializable = DeserializableRegistry.getDeserializable(new ManualRegistrationClass());
  const deepDeserializableMemberNames: string[] = manualRegistrationDeserializable.getDeepDeserializableMemberNames();
  expect(deepDeserializableMemberNames).to.include('_date');

  // Ensure that correct constructor functions are associated with deep deserializable members.
  for (let i = 0; i < deepDeserializableMemberNames.length; i++) {

    const deepDeserializableMemberConstructor: Function = manualRegistrationDeserializable.getDeepDeserializableMemberConstructor(deepDeserializableMemberNames[i]);
    expect(deepDeserializableMemberConstructor).to.eql(Date);
  }

  done();
}

function testRecordSkippedMembers(done: MochaDone): void {
  skipDeserializable()(ManualRegistrationClass.prototype, '_skippedProperty');
  skipDeserializable()(ManualRegistrationClass.prototype, '_skippedMethod');

  // Ensure that all skipped members have been recorded.
  const manualRegistrationDeserializable: Deserializable = DeserializableRegistry.getDeserializable(new ManualRegistrationClass());
  const skippedDeserializationMemberNames: string[] = manualRegistrationDeserializable.getSkippedDeserializableMemberNames();
  expect(skippedDeserializationMemberNames).to.include('_skippedProperty');
  expect(skippedDeserializationMemberNames).to.include('_skippedMethod');

  done();
}
