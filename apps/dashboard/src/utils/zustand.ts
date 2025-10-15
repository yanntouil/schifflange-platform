import { Patch, evolve as evolveFn } from "evolve-ts"
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

  /**
   * hook to retrieve the store
   * this method is used to hook the store
   * @returns the store
   */
  const useStore = createStore<S>()(config)

  /**
   * dream the state
   * this method is used to dream the state using the dream function
   * @param updateState - the partial state to update or the function to update the state
   * @param state - the current state
   * @returns the next state
   */
  const dream = (updateState: Partial<S> | ((state: S) => S), state: S = useStore.getState()) => {
    const nextPartialState = typeof updateState === "function" ? updateState(state) : updateState
    const nextState: S = { ...state, ...nextPartialState }
    return nextState
  }

  /**
   * set the state
   * this method is used to set the state using the dream function
   * @param updateState - the partial state to update or the function to update the state
   * @returns void
   */
  const set = (updateState: Partial<S> | ((state: S) => S)) => {
    useStore.setState((state) => {
      return dream(updateState, state)
    }, true)
  }

  /**
   * reset the state
   * this method is used to reset the state to the initial state
   * @returns void
   */
  const reset = () => {
    set(initState)
  }

  /**
   * evolve the state
   * this method is used to evolve the state using the evolve-ts library
   * @param patch - the patch to apply to the state
   * @returns void
   */
  const evolve = (patch: Patch<S>) => {
    set(evolveFn(patch))
  }

  return {
    use: useStore,
    evolve,
    dream,
    reset,
    set,
    get current() {
      return useStore.getState()
    },
    actions,
  }
}
