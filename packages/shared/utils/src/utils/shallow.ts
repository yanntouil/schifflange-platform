import { shallowEvolve } from 'evolve-ts'

export const shallow = shallowEvolve

export type Reducer<S> = (state: S) => S
export type ReducerHandler<S> = (reducer: Reducer<S>) => void
