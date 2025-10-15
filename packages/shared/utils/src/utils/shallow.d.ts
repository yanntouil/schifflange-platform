export declare const shallow: import("evolve-ts").ShallowEvolve;
export type Reducer<S> = (state: S) => S;
export type ReducerHandler<S> = (reducer: Reducer<S>) => void;
