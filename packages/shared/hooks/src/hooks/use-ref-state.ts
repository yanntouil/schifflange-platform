import { F, G } from "@compo/utils"
import React from "react"

/**
 * useRefState
 */

export const useRefState = <S>(initialState: S | (() => S), constraint: (value: S) => S = F.identity) => {
  const [reactState, setReactState] = React.useState(initialState)
  const initialStateRef = React.useRef(reactState)
  const stateRef = React.useRef(reactState)

  const setState: React.Dispatch<React.SetStateAction<S>> = (action) => {
    stateRef.current = constraint(G.isFunction(action) ? action(stateRef.current) : action)
    setReactState(stateRef.current)
  }

  const get = () => stateRef.current

  return {
    set: setState,
    reset: () => setState(initialStateRef.current),
    init: () => initialStateRef.current,
    value: (): Readonly<S> => {
      return get()
    },
  }
}

export const useRefStateWithDirty = <S>(initialState: S | (() => S)) => {
  const state = useRefState(initialState)
  const dirty = useRefState(false)

  return {
    ...state,
    isDirty: dirty.value,
    value: state.value,
    set: (value: React.SetStateAction<S>) => {
      state.set(value)
      dirty.set(true)
    },
    reset: () => {
      state.reset()
      dirty.set(false)
    },
  }
}
