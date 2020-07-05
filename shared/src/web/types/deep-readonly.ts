import { DeepReadonly as _DeepReadonly } from 'ts-essentials';

/**
 * Like readonly, but recursive/deep.
 * Unlike 3rd party DeepReadonly, allows to assign mutable type T to DeepReadonly<T> without an explicit type cast.
 */
export type DeepReadonly<T> = Readonly<T> | _DeepReadonly<T>;
