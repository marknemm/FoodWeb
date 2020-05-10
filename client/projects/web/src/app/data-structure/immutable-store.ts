import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, skip, takeUntil } from 'rxjs/operators';
import { DeepReadonly } from '~shared';

/**
 * A simple redux-like store for maintaining state throughout Foodweb.
 */
export class ImmutableStore<T> {

  /**
   * The raw internal store value.
   */
  private _value: T
  /**
   * A behavior subject that emits the raw internal store value when setValue is invoked.
   */
  private _value$: BehaviorSubject<T>;

  constructor(initValue?: T) {
    this._value = initValue;
    this._value$ = new BehaviorSubject<T>(this._value);
  }

  /**
   * The current immutable store value.
   */
  get value(): DeepReadonly<T> {
    return <DeepReadonly<T>>this._value;
  }

  /**
   * An observable that emits the current immutable store value, and any updates to it.
   */
  get value$(): Observable<DeepReadonly<T>> {
    return this._value$.asObservable();
  }

  /**
   * An observable that emits any updates to the immutable store's value, but not the current value.
   */
  get valueUpdates$(): Observable<DeepReadonly<T>> {
    return this._value$.asObservable().pipe(skip(1));
  }

  getValue$(destroy$: Observable<any>): Observable<DeepReadonly<T>> {
    return this.value$.pipe(takeUntil(destroy$));
  }

  getValueUpdates$(destroy$: Observable<any>): Observable<DeepReadonly<T>> {
    return this.valueUpdates$.pipe(takeUntil(destroy$));
  }

  /**
   * Retrieves the store's mutable value.
   * @param cloneLevel An optional flag used to determine the level of cloning that should occur before returning the value.
   * Defaults to CloneLevel.None.
   * @return The store's mutable value.
   */
  getMutableValue(cloneLevel = CloneLevel.None): T {
    return this._cloneWithLevel(this._value, cloneLevel);
  }

  /**
   * Retrieves an oversable which emits a reference to the store's mutable value.
   * @param cloneLevel An optional falg used to determine the level of cloning that should occur before emitting the value.
   * Defaults to CloneLevel.None.
   * @return An observable that emits the store's current mutable value, and any updates to it.
   */
  getMutableValue$(cloneLevel = CloneLevel.None): Observable<T> {
    return this._value$.asObservable().pipe(
      map((value: T) => this._cloneWithLevel(value, cloneLevel))
    );
  }

  /**
   * Retrieves a specified property within the immutable store's value.
   * @param propertyName The name of the property to retrieve.
   * @return The immutable store value's property.
   */
  getMutableProperty<K extends Extract<keyof T, string>>(propertyName: K, cloneLevel = CloneLevel.None): T[K] {
    const propertyVal: T[K] = (this._value ? this._value[propertyName] : undefined);
    return this._cloneWithLevel(propertyVal, cloneLevel);
  }

  /**
   * @param value The new value to set.
   * IMPORTANT: If the clone level is not set, then any external changes made to the object will be reflected in the store!
   * @param cloneLevel Optionally, set the clone level for the value that is to be set. Defaults to None.
   * @param preventValueEmit Optionally, set to true if this should not result in the value$ observable emitting the updated value.
   * @return The set value.
   */
  setValue(value: DeepReadonly<T>, cloneLevel = CloneLevel.None, preventValueEmit = false): DeepReadonly<T> {
    value = this._cloneWithLevel(value, cloneLevel);
    this._value = <T>value;
    if (!preventValueEmit) {
      this._value$.next(this._value);
    }
    return <DeepReadonly<T>>this._value;
  }

  /**
   * Clones a given value to a certain level (Deep, Shallow, or None).
   * @param value The value that is to be cloned.
   * @param cloneLevel The level of cloning to perform.
   * @return The value with the level of cloning applied.
   */
  private _cloneWithLevel<C>(value: C, cloneLevel: CloneLevel): C {
    switch (cloneLevel) {
      case CloneLevel.Deep:     return _.cloneDeep(value);
      case CloneLevel.Shallow:  return Object.assign({}, value);
      default:                  return value;
    }
  }
}

/**
 * The level of cloning that should occur on an object.
 */
export enum CloneLevel { Deep, Shallow, None };
