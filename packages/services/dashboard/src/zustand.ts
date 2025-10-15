import { Patch, evolve } from "evolve-ts"
import { StateCreator, create } from "zustand"
import { DevtoolsOptions, PersistOptions, devtools, persist } from "zustand/middleware"

export const decorateStore = <
  A extends Record<string, (...args: any[]) => any | Promise<any>>,
  S extends object,
  P extends PersistOptions<S, Partial<S>> = PersistOptions<S, Partial<S>>,
>(
  initState: S,
  createStore: typeof create,
  middleware: { persist?: P; devtools?: DevtoolsOptions },
  actions: A = {} as A
) => {
  let config: StateCreator<S, any, P extends PersistOptions<S> ? [["zustand/persist", S]] : []> = () => initState

  if (middleware.persist) config = persist(config, middleware.persist) as any
  if (middleware.devtools) config = devtools(config, middleware.devtools) as any

  const useStore = createStore<S>()(config)

  const dream = (updateState: Partial<S> | ((state: S) => S), state: S = useStore.getState()) => {
    const nextPartialState = typeof updateState === "function" ? updateState(state) : updateState
    const nextState: S = { ...state, ...nextPartialState }
    return nextState
  }

  // fix set state
  const set = (updateState: Partial<S> | ((state: S) => S)) => {
    useStore.setState((state) => {
      return dream(updateState, state)
    }, true)
  }

  const reset = () => {
    set(initState)
  }

  const evolveMethod = (patch: Patch<S>) => {
    set(evolve(patch))
  }

  return {
    use: useStore,
    evolve: evolveMethod,
    dream,
    reset,
    set,
    get current() {
      return useStore.getState()
    },
    actions,
  }
}
