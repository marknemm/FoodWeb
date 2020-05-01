import { ObservableStore, ObservableStoreSettings, StateWithPropertyChanges } from '@codewithdan/observable-store';
import { stateFunc } from '@codewithdan/observable-store/dist/observable-store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeepReadonly } from 'utility-types';
import { environment } from '~web/environments/environment';
export { ObservableStoreSettings };

// Setup default global settings for Observable Store.
ObservableStore.globalSettings = {
  logStateChanges: false,
  isProduction: environment.production,
  trackStateHistory: !environment.production,
};

/**
 * A simple redux-like store for maintaining state throughout Foodweb.
 * @extends ObservableStore
 */
export class ImmutableStore<T> extends ObservableStore<DeepReadonly<T>> {

  constructor(settings: ObservableStoreSettings = {}) {
    super(settings);
  }

  /**
   * Retrieves the store's state as a reference to the mutable stored value.
   * @param cloneState An optional flag used to determine the level of cloning that should occur before returning the retrieved state.
   * Defaults to CloneLevel.None.
   * @return The store's state.
   */
  getMutableState(cloneState = CloneLevel.None): T {
    const state = <T>super.getState(cloneState === CloneLevel.Deep);
    return (cloneState === CloneLevel.Shallow)
      ? Object.assign({}, state)
      : state;
  }

  /**
   * Subscribe to store changes in the particlar slice of state updated by a Service.
   * If the store contains 'n' slices of state each being managed by one of 'n' services,
   * then changes in any of the other slices of state will not generate values in the stateChanged stream.
   * @param cloneState An optional flag used to determine the level of cloning that should occur before emitting the changed state.
   * Defaults to CloneLevel.None.
   * @return An RxJS Observable containing the current store state
   * (or a specific slice of state if a stateSliceSelector has been specified).
   */
  getMutableStateChanged(cloneState = CloneLevel.None): Observable<T> {
    return this.stateChanged.pipe(
      map((state: DeepReadonly<T>) => {
        switch (cloneState) {
          case CloneLevel.Deep:     return _.cloneDeep(<T>state);
          case CloneLevel.Shallow:  return Object.assign({}, <T>state);
          default:                  return <T>state;
        }
      })
    );
  }

  /**
   * Retrieves a specified property within the store's state.
   * @param propertyName The name of the property to retrieve.
   * @param cloneState On optional flag used to determine the level of cloning that should occur before returning the state property slice.
   * Defaults to CloneLevel.None.
   * @return The store's state property.
   */
  getMutableStateProperty<K extends Extract<keyof T, string>, P = T[K]>(propertyName: K, cloneState = CloneLevel.None): P {
    const statePropValue: P = super.getStateProperty<P>(propertyName, cloneState === CloneLevel.Deep);
    return (cloneState === CloneLevel.Shallow)
      ? Object.assign({}, statePropValue)
      : statePropValue;
  }

  /**
   * Subscribe to store changes in the particlar slice of state updated by a Service and also include the properties that changed as well.
   * Upon subscribing to stateWithPropertyChanges you will get back an object containing state
   * (which has the current slice of store state) and stateChanges
   * (which has the individual properties/data that were changed in the store).
   * @param cloneState On optional flag used to determine the level of cloning that should occur before emitting the state property slice
   * change. Defaults to CloneLevel.None.
   * @return An rxJS Observable containing the current store state's property value.
   */
  getMutableStateWithPropertyChanged(cloneState = CloneLevel.None): Observable<StateWithPropertyChanges<T>> {
    return this.stateWithPropertyChanges.pipe(
      map((stateWithPropChanges: StateWithPropertyChanges<DeepReadonly<T>>) => {
        switch (cloneState) {
          case CloneLevel.Deep:     return _.cloneDeep(<StateWithPropertyChanges<T>>stateWithPropChanges);
          case CloneLevel.Shallow:  return Object.assign({}, <StateWithPropertyChanges<T>>stateWithPropChanges);
          default:                  return <StateWithPropertyChanges<T>>stateWithPropChanges;
        }
      })
    );
  }

  /**
   * Retrieves the store's state.
   * @return The store's immutable state.
   */
  getState(): DeepReadonly<T> {
    return super.getState(false);
  }

  /**
   * Retrieves a specified property within the store's state.
   * @param propertyName The name of the property to retrieve.
   * @return The store's immutable state property.
   */
  getStateProperty<K extends Extract<keyof DeepReadonly<T>, string>, P = DeepReadonly<T>[K]>(propertyName: K): P {
    return super.getStateProperty(propertyName, false);
  }

  /**
   * @override
   * @param state Either the state update object or a function which takes as input the old state object and returns a state update object.
   * @param action An optional action string describing the state update (for debugging purposes).
   * @param dispatchState An optional flag that controls whether or not the state change is dispatched to subscribers
   * of the store's state change observables. Defaults to true.
   * @return The set deep readonly state.
   */
  setState(state: ObservableStoreState<T>, action?: string, dispatchState?: boolean): DeepReadonly<T> {
    return super.setState(<DeepReadonly<T>>state, action, dispatchState);
  }
}

export type ObservableStoreState<T> = Partial<T> | Partial<DeepReadonly<T>> | stateFunc<T> | stateFunc<DeepReadonly<T>>;
export enum CloneLevel { Deep, Shallow, None };
